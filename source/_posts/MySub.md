代码:

```python
from PySide6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout,
                              QHBoxLayout, QLineEdit, QPushButton, QLabel,
                              QScrollArea, QStackedWidget, QTableWidget,
                              QTableWidgetItem, QHeaderView, QComboBox,
                              QAbstractItemView, QMessageBox, QSpinBox)
from PySide6.QtCore import Qt, QTimer, QThread, Signal, QUrl, QPropertyAnimation, QPoint, QEasingCurve
from urllib.parse import quote_plus
from PySide6.QtGui import QFont, QDesktopServices, QFontMetrics
from urllib.parse import urlparse
from urllib.parse import urlunparse, parse_qsl, urlencode, unquote
import sys
import os
import json
import requests
import time
from datetime import datetime
from typing import Any, Optional


class FansAPIManager:
    def __init__(self):
        # 粉丝数 API 列表，每项为 dict: {"name":..., "api_url":..., "api_key":..., "fans_path":...}
        self.fans_apis = []
        # 每次获取粉丝数的冷却（秒）
        self.cooldown = 60
        # 要显示的用户名
        self.username = ""
        self.theme_mode = "light"
        # 尝试从磁盘加载已保存设置
        try:
            self.load_settings()
        except Exception:
            pass
    
    def get_settings_path(self):
        appdata = os.getenv('APPDATA') or os.path.expanduser('~')
        folder = os.path.join(appdata, 'MySub')
        os.makedirs(folder, exist_ok=True)
        return os.path.join(folder, 'settings.json')

    def load_settings(self):
        path = self.get_settings_path()
        if not os.path.exists(path):
            return
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception:
            return

        # 加载粉丝数 API 列表
        try:
            fa = data.get('fans_apis')
            if isinstance(fa, list):
                self.fans_apis = fa
        except Exception:
            self.fans_apis = []

        # 冷却与用户名
        try:
            cd = data.get('cooldown')
            if isinstance(cd, (int, float)) and cd > 0:
                self.cooldown = int(cd)
        except Exception:
            self.cooldown = 60
        try:
            un = data.get('username')
            if isinstance(un, str):
                self.username = un
        except Exception:
            self.username = ""

        # 主题
        tm = data.get('theme_mode')
        if tm in ('light', 'dark', 'system'):
            self.theme_mode = tm

    def save_settings(self):
        path = self.get_settings_path()
        data = {
            # 粉丝数 API 列表与冷却/用户名
            'fans_apis': self.fans_apis,
            'cooldown': self.cooldown,
            'username': self.username,
            'theme_mode': self.theme_mode
        }
        try:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception:
            # 保存失败时忽略（不影响主流程）
            pass

    def log_error(self, message: str) -> str:
        """把错误信息写入到 %APPDATA%/MySub/Logs 下，返回日志文件路径。"""
        try:
            appdata = os.getenv('APPDATA') or os.path.expanduser('~')
            folder = os.path.join(appdata, 'MySub', 'Logs')
            os.makedirs(folder, exist_ok=True)
            fname = datetime.now().strftime("%Y_%m_%d_%H_%M_%S_MySub_ErrorLog.log")
            path = os.path.join(folder, fname)
            with open(path, 'w', encoding='utf-8') as f:
                f.write(f"[{datetime.now().isoformat()}]\n")
                f.write(message)
                f.write('\n')
            return path
        except Exception:
            return ''


class FanFetcher(QThread):
    """后台按配置请求各平台粉丝数，完成后发出字典{name: fans_int}。"""
    fans_ready = Signal(dict)
    error_occurred = Signal(str)

    def __init__(self, api_manager, parent=None):
        super().__init__(parent)
        self.api_manager = api_manager

    def run(self):
        results = {}
        try:
            apis = list(getattr(self.api_manager, 'fans_apis', []) or [])
            # helper to get by path (支持 .a.b)
            def _get_by_path(obj, path):
                if not path:
                    return obj
                if path == '.' or path == '':
                    return obj
                if path.startswith('.'):
                    path = path[1:]
                parts = [p for p in path.split('.') if p]
                cur = obj
                try:
                    for p in parts:
                        if isinstance(cur, dict):
                            cur = cur.get(p)
                        elif isinstance(cur, list):
                            # 不支持索引访问，返回 None
                            return None
                        else:
                            return None
                    return cur
                except Exception:
                    return None

            for cfg in apis:
                try:
                    name = cfg.get('name') or cfg.get('api_name') or 'unknown'
                    api_url = cfg.get('api_url') or ''
                    api_key = cfg.get('api_key') or cfg.get('apikey') or ''
                    fans_path = cfg.get('fans_path') or cfg.get('fans_pos') or cfg.get('results_path') or ''

                    # 支持 {apikey} 和 {username} 占位符
                    req_url = api_url
                    if '{apikey}' in req_url:
                        req_url = req_url.replace('{apikey}', quote_plus(api_key or ''))
                    if '{api_key}' in req_url:
                        req_url = req_url.replace('{api_key}', quote_plus(api_key or ''))
                    if '{username}' in req_url:
                        req_url = req_url.replace('{username}', quote_plus(self.api_manager.username or ''))

                    # 发起请求
                    try:
                        resp = requests.get(req_url, timeout=(15, 60))
                    except Exception as e:
                        self.error_occurred.emit(f"请求 {name} 失败: {repr(e)}")
                        continue

                    j = None
                    try:
                        j = resp.json()
                    except Exception:
                        j = None

                    val = None
                    if j is not None:
                        val = _get_by_path(j, fans_path)
                    # 允许直接文本返回
                    if val is None and isinstance(resp.text, str):
                        # 尝试直接解析全文为数字（去掉非数字字符）
                        txt = resp.text.strip()
                        if txt:
                            val = txt

                    # 尝试把 val 转为 int
                    parsed = None
                    try:
                        if isinstance(val, int):
                            parsed = int(val)
                        elif isinstance(val, float):
                            parsed = int(val)
                        elif isinstance(val, str):
                            s = val.strip()
                            # 去掉逗号和空格
                            s2 = s.replace(',', '').replace('，', '').replace(' ', '')
                            # 只要开头包含数字就取连续数字
                            import re
                            m = re.search(r"(\d+)", s2)
                            if m:
                                parsed = int(m.group(1))
                    except Exception:
                        parsed = None

                    if parsed is None:
                        # 不是 int，记录日志并丢弃
                        try:
                            self.api_manager.log_error(f"平台 {name} 返回的粉丝数无法解析: {repr(val)} (url: {req_url})")
                        except Exception:
                            pass
                        continue

                    results[name] = int(parsed)
                except Exception as e:
                    try:
                        self.api_manager.log_error(f"处理平台配置出错: {repr(e)}\n配置: {cfg}")
                    except Exception:
                        pass
                    continue

        except Exception as e:
            try:
                self.error_occurred.emit(f"获取粉丝数线程失败: {repr(e)}")
            except Exception:
                pass
        # 发出结果（可能为空）
        try:
            self.fans_ready.emit(results)
        except Exception:
            pass


class AnimatedDigit(QWidget):
    def __init__(self, ch='0', parent=None, font_size=36, width=30, height=60):
        super().__init__(parent)
        # 先创建字体并用字体度量决定最小宽度，避免传入的 width 太小导致字符被裁剪
        self.font = QFont()
        self.font.setPointSize(font_size)
        fm = QFontMetrics(self.font)
        minw = fm.horizontalAdvance('0') + 8
        # 保证宽度至少为字符最小宽度
        try:
            self.width = max(width or 0, minw)
        except Exception:
            self.width = max(30, minw)
        self.height = height
        self.setFixedSize(self.width, self.height)

        # 两个标签用于滚动动画：old 在上，新在下；给标签增加一点内边距，减少裁剪风险
        self.label_old = QLabel(self)
        self.label_old.setAlignment(Qt.AlignCenter)
        self.label_old.setFont(self.font)
        self.label_old.setContentsMargins(4, 0, 4, 0)
        self.label_old.setGeometry(0, 0, self.width, self.height)

        self.label_new = QLabel(self)
        self.label_new.setAlignment(Qt.AlignCenter)
        self.label_new.setFont(self.font)
        self.label_new.setContentsMargins(4, 0, 4, 0)
        self.label_new.setGeometry(0, self.height, self.width, self.height)

        self.current = str(ch)
        self.label_old.setText(self.current)
        self.anim_old = None
        self.anim_new = None

    def animate_to(self, new_ch: str, duration=400):
        new_ch = str(new_ch)
        if new_ch == self.current:
            return
        # 准备标签内容与位置
        self.label_old.setText(self.current)
        self.label_old.move(0, 0)
        self.label_new.setText(new_ch)
        self.label_new.move(0, self.height)

        # 动画：old 向上移出，新从下移入
        try:
            self.anim_old = QPropertyAnimation(self.label_old, b'pos')
            self.anim_old.setDuration(duration)
            self.anim_old.setStartValue(QPoint(0, 0))
            self.anim_old.setEndValue(QPoint(0, -self.height))
            self.anim_old.setEasingCurve(QEasingCurve.OutCubic)

            self.anim_new = QPropertyAnimation(self.label_new, b'pos')
            self.anim_new.setDuration(duration)
            self.anim_new.setStartValue(QPoint(0, self.height))
            self.anim_new.setEndValue(QPoint(0, 0))
            self.anim_new.setEasingCurve(QEasingCurve.OutCubic)

            # 启动动画
            self.anim_old.start()
            self.anim_new.start()

            # 动画结束时更新状态
            def on_finished():
                try:
                    self.current = new_ch
                    self.label_old.setText(self.current)
                    self.label_old.move(0, 0)
                    self.label_new.move(0, self.height)
                except Exception:
                    pass

            # 通过连接 anim_new.finished
            try:
                self.anim_new.finished.connect(on_finished)
            except Exception:
                on_finished()
        except Exception:
            # 回退：直接替换文本
            self.current = new_ch
            self.label_old.setText(self.current)
            self.label_old.move(0, 0)
            self.label_new.move(0, self.height)


class AnimatedNumberWidget(QWidget):
    def __init__(self, parent=None, font_size=48, digit_width=30, digit_height=60, spacing=4):
        super().__init__(parent)
        self.font_size = font_size
        self.digit_width = digit_width
        self.digit_height = digit_height
        self.spacing = spacing
        self.digits = []
        self.value = 0
        self.container = QWidget(self)
        self.hbox = QHBoxLayout(self.container)
        self.hbox.setContentsMargins(0, 0, 0, 0)
        self.hbox.setSpacing(self.spacing)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(self.container)

    def set_value(self, val: int):
        try:
            val = int(val)
        except Exception:
            return
        s = str(val)[::-1]
        self._ensure_digits(len(s))
        # 更新每位
        for i, ch in enumerate(s.rjust(len(self.digits), '0')):
            self.digits[i].animate_to(ch)
        self.value = val

    def _ensure_digits(self, n: int):
        # 如果当前位数不足则增加
        while len(self.digits) < n:
            d = AnimatedDigit('0', parent=self.container, font_size=self.font_size, width=self.digit_width, height=self.digit_height)
            self.hbox.addWidget(d)
            self.digits.insert(0, d)  # 在左侧插入（高位）
        # 如果比需要多，则移除左侧多余位
        while len(self.digits) > n:
            w = self.digits.pop(0)
            w.setParent(None)
            w.deleteLater()


class SettingsWindow(QMainWindow):
    def __init__(self, api_manager, parent=None):
        super().__init__(parent)
        self.api_manager = api_manager
        self.current_nav_key = "basic"
        self.setup_ui()
        self.apply_theme_to_settings(api_manager.theme_mode)

    def setup_ui(self):
        self.setWindowTitle("设置 - MySub")
        self.setFixedSize(800, 600)
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QHBoxLayout(central_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)
        
        # 左侧导航栏
        self.sidebar = QWidget()
        self.sidebar.setFixedWidth(200)
        sidebar_layout = QVBoxLayout(self.sidebar)
        sidebar_layout.setContentsMargins(0, 20, 0, 20)
        sidebar_layout.setSpacing(0)
        
        # 设置标题
        settings_title = QLabel("设置")
        settings_title.setObjectName("settings_title")
        settings_title.setStyleSheet("""
            QLabel#settings_title {
                font-size: 18px;
                font-weight: bold;
                padding: 15px 20px;
            }
        """)
        sidebar_layout.addWidget(settings_title)
        
        # 导航按钮
        self.nav_buttons = {}
        nav_items = [
            ("基础设置", "basic"),
            ("粉丝数API", "fans_api"),
            ("关于", "about")
        ]
        
        for text, key in nav_items:
            btn = QPushButton(text)
            btn.setFixedHeight(45)
            btn.setObjectName("nav_button")
            btn.setProperty('nav_key', key)
            btn.clicked.connect(self.on_nav_click)
            sidebar_layout.addWidget(btn)
            self.nav_buttons[key] = btn
        
        sidebar_layout.addStretch()
        main_layout.addWidget(self.sidebar)
        
        # 右侧内容区域
        self.content_stack = QStackedWidget()
        self.content_stack.setObjectName("content_stack")
        
        # 创建各个设置页面
        self.basic_page = self.create_basic_page()
        self.fans_api_page = self.create_fans_api_page()
        self.about_page = self.create_about_page()

        self.content_stack.addWidget(self.basic_page)
        self.content_stack.addWidget(self.fans_api_page)
        self.content_stack.addWidget(self.about_page)
        
        main_layout.addWidget(self.content_stack)
        
        # 默认选中基础设置
        self.update_nav_style()
        
    def create_basic_page(self):
        widget = QWidget()
        layout = QVBoxLayout(widget)
        layout.setContentsMargins(30, 30, 30, 30)
        
        title = QLabel("基础设置")
        title.setObjectName("page_title")
        title.setStyleSheet("""
            QLabel#page_title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }
        """)
        layout.addWidget(title)
        
        # 主题设置
        theme_label = QLabel("主题模式")
        theme_label.setObjectName("section_title")
        theme_label.setStyleSheet("""
            QLabel#section_title {
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
        """)
        layout.addWidget(theme_label)
        
        self.theme_combo = QComboBox()
        self.theme_combo.addItems(["浅色模式", "深色模式", "跟随系统"])
        # 设置当前主题
        if self.api_manager.theme_mode == "light":
            self.theme_combo.setCurrentText("浅色模式")
        elif self.api_manager.theme_mode == "dark":
            self.theme_combo.setCurrentText("深色模式")
        else:
            self.theme_combo.setCurrentText("跟随系统")
            
        self.theme_combo.setObjectName("theme_combo")
        self.theme_combo.currentTextChanged.connect(self.on_theme_changed)
        layout.addWidget(self.theme_combo)
        
        # 获取冷却设置（秒）
        cooldown_label = QLabel("获取冷却（秒）")
        cooldown_label.setObjectName("section_title")
        layout.addWidget(cooldown_label)

        self.cooldown_spin = QSpinBox()
        self.cooldown_spin.setRange(1, 86400)
        self.cooldown_spin.setValue(int(getattr(self.api_manager, 'cooldown', 60)))
        self.cooldown_spin.setSuffix(' s')
        self.cooldown_spin.valueChanged.connect(self._on_cooldown_changed)
        layout.addWidget(self.cooldown_spin)

        # 用户名设置
        username_label = QLabel("用户名")
        username_label.setObjectName("section_title")
        layout.addWidget(username_label)

        self.username_edit = QLineEdit()
        self.username_edit.setText(getattr(self.api_manager, 'username', '') or '')
        self.username_edit.setPlaceholderText('输入要显示的用户名')
        self.username_edit.editingFinished.connect(self._on_username_changed)
        layout.addWidget(self.username_edit)
        
        layout.addStretch()
        return widget
    
    def create_fans_api_page(self):
        widget = QWidget()
        layout = QVBoxLayout(widget)
        layout.setContentsMargins(30, 30, 30, 30)

        title = QLabel("粉丝数 API 设置")
        title.setObjectName("page_title")
        layout.addWidget(title)

        info = QLabel("配置每个平台的粉丝数 API。APIURL 需要包含 {apikey} 占位符，支持 {username} 占位符。")
        layout.addWidget(info)

        # 表格（名称、APIURL、APIKEY、粉丝数路径）
        self.api_table = QTableWidget(len(self.api_manager.fans_apis), 4)
        self.api_table.setHorizontalHeaderLabels(["名称", "APIURL", "APIKEY", "粉丝数路径"])
        self.api_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.api_table.setEditTriggers(QAbstractItemView.AllEditTriggers)

        # 填充数据
        for row, cfg in enumerate(self.api_manager.fans_apis):
            name_item = QTableWidgetItem(cfg.get('name', ''))
            apiurl_item = QTableWidgetItem(cfg.get('api_url', ''))
            apikey_item = QTableWidgetItem(cfg.get('api_key', ''))
            fans_path_item = QTableWidgetItem(cfg.get('fans_path', ''))
            self.api_table.setItem(row, 0, name_item)
            self.api_table.setItem(row, 1, apiurl_item)
            self.api_table.setItem(row, 2, apikey_item)
            self.api_table.setItem(row, 3, fans_path_item)

        layout.addWidget(self.api_table)

        # 添加和删除按钮
        api_btn_layout = QHBoxLayout()
        add_api_btn = QPushButton("+ 添加")
        delete_api_btn = QPushButton("- 删除选中")
        add_api_btn.clicked.connect(self.add_api_item)
        delete_api_btn.clicked.connect(self.delete_api_item)
        api_btn_layout.addWidget(add_api_btn)
        api_btn_layout.addWidget(delete_api_btn)
        api_btn_layout.addStretch()
        layout.addLayout(api_btn_layout)

        # 自动保存：响应表格变化，不需要保存按钮
        self.api_table.itemChanged.connect(self.on_api_table_changed)

        layout.addStretch()
        return widget

    def add_api_item(self):
        row = self.api_table.rowCount()
        self.api_table.insertRow(row)
        name_item = QTableWidgetItem("")
        apiurl_item = QTableWidgetItem("")
        apikey_item = QTableWidgetItem("")
        fans_path_item = QTableWidgetItem("")
        self.api_table.setItem(row, 0, name_item)
        self.api_table.setItem(row, 1, apiurl_item)
        self.api_table.setItem(row, 2, apikey_item)
        self.api_table.setItem(row, 3, fans_path_item)
        self.on_api_table_changed()

    def delete_api_item(self):
        current_row = self.api_table.currentRow()
        if current_row >= 0:
            self.api_table.removeRow(current_row)
            self.on_api_table_changed()
    
    def create_about_page(self):
        widget = QWidget()
        layout = QVBoxLayout(widget)
        layout.setContentsMargins(30, 30, 30, 30)
        
        title = QLabel("关于 MySub")
        title.setObjectName("page_title")
        layout.addWidget(title)
        
        about_text = QLabel("""
        <h3>粉丝聚合器</h3>
        <p>本程序可按配置定时从多个平台获取粉丝数并聚合显示。</p>
        <br>
        <p><b>版本:</b> 1.0.0</p>
        <p><b>开发者:</b> Qiufeng</p>
        <p><b>说明:</b> 在设置中配置每个平台的 APIURL、APIKEY 与粉丝数 JSON 路径（或直接解析文本），支持 URL 中使用 <code>{apikey}</code> 和 <code>{username}</code> 占位符。</p>
        <br>
        <p>获取到的非整数结果将被丢弃并记录日志。</p>
        """)
        about_text.setWordWrap(True)
        layout.addWidget(about_text)
        
        layout.addStretch()
        return widget

    def on_api_table_changed(self):
        # 从 api_table 重建粉丝数 API 列表并保存
        fps = []
        for row in range(self.api_table.rowCount()):
            name_item = self.api_table.item(row, 0)
            api_url_item = self.api_table.item(row, 1)
            api_key_item = self.api_table.item(row, 2)
            fans_path_item = self.api_table.item(row, 3)
            if not name_item:
                continue
            name = name_item.text()
            api_url = api_url_item.text() if api_url_item else ''
            api_key = api_key_item.text() if api_key_item else ''
            fans_path = fans_path_item.text() if fans_path_item else ''
            fps.append({'name': name, 'api_url': api_url, 'api_key': api_key, 'fans_path': fans_path})

        # 覆盖并保存
        self.api_manager.fans_apis = fps
        try:
            self.api_manager.save_settings()
        except Exception:
            pass
    
    def on_nav_click(self):
        button = self.sender()
        new_nav_key = button.property('nav_key')
        
        if new_nav_key != self.current_nav_key:
            self.current_nav_key = new_nav_key
            self.update_nav_style()
            
            page_index = {
                "basic": 0, "fans_api": 1, "about": 2
            }[new_nav_key]
            self.content_stack.setCurrentIndex(page_index)
    
    def update_nav_style(self):
        for key, btn in self.nav_buttons.items():
            if key == self.current_nav_key:
                btn.setStyleSheet("""
                    QPushButton {
                        text-align: left;
                        padding: 12px 20px;
                        border: none;
                        background-color: #1a73e8;
                        color: white;
                        font-size: 14px;
                        border-radius: 0px;
                    }
                """)
            else:
                btn.setStyleSheet("""
                    QPushButton {
                        text-align: left;
                        padding: 12px 20px;
                        border: none;
                        background-color: transparent;
                        color: #666;
                        font-size: 14px;
                        border-radius: 0px;
                    }
                    QPushButton:hover {
                        background-color: #e8f0fe;
                        color: #1a73e8;
                    }
                """)
    
    def on_theme_changed(self, theme_text):
        if theme_text == "浅色模式":
            theme = "light"
        elif theme_text == "深色模式":
            theme = "dark"
        else:  # 跟随系统
            theme = "system"
        self.api_manager.theme_mode = theme
        if self.parent():
            self.parent().apply_theme(theme)
        self.apply_theme_to_settings(theme)
        # 主题更改后自动保存设置
        try:
            self.api_manager.save_settings()
        except Exception:
            pass

    def _on_cooldown_changed(self, v):
        try:
            self.api_manager.cooldown = int(v)
            self.api_manager.save_settings()
        except Exception:
            pass

    def _on_username_changed(self):
        try:
            self.api_manager.username = (self.username_edit.text() or '').strip()
            self.api_manager.save_settings()
        except Exception:
            pass
    
    def apply_theme_to_settings(self, theme):
        if theme == "light":
            self.setStyleSheet("""
                QMainWindow {
                    background-color: white;
                }
                QWidget#sidebar {
                    background-color: #f8f9fa;
                    border-right: 1px solid #e0e0e0;
                }
                QLabel#settings_title {
                    color: #333;
                }
                QLabel#page_title, QLabel#section_title {
                    color: #333;
                }
                QStackedWidget#content_stack {
                    background-color: white;
                }
                QTableWidget {
                    background-color: white;
                    color: black;
                }
            """)
        else:
            self.setStyleSheet("""
                QMainWindow {
                    background-color: #202124;
                }
                QWidget#sidebar {
                    background-color: #303134;
                    border-right: 1px solid #5f6368;
                }
                QLabel#settings_title {
                    color: #e8eaed;
                }
                QLabel#page_title, QLabel#section_title {
                    color: #e8eaed;
                }
                QStackedWidget#content_stack {
                    background-color: #303134;
                }
                QTableWidget {
                    background-color: #303134;
                    color: #e8eaed;
                }
            """)


class MySubWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.api_manager = FansAPIManager()
        self.setup_ui()
        
    def setup_ui(self):
        self.setWindowTitle("MySub")
        self.setMinimumSize(1000, 700)
        
        # 创建中央部件
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.main_layout = QVBoxLayout(self.central_widget)
        self.main_layout.setContentsMargins(50, 30, 50, 20)
        self.main_layout.setSpacing(0)
        
        # 顶部搜索区域
        self.setup_top_area()
        
        # 主内容区域 - 现在为空
        self.setup_content_area()
        
        # 底部区域
        self.setup_bottom_area()
        
        # 应用主题
        self.apply_theme(self.api_manager.theme_mode)
        # 粉丝数轮询定时器（基于设置中的 cooldown）
        try:
            self.fans_timer = QTimer(self)
            self.fans_timer.setInterval(max(1, int(self.api_manager.cooldown)) * 1000)
            self.fans_timer.timeout.connect(self.fetch_fans)
            # 立即触发一次并开始定时
            self.fetch_fans()
            self.fans_timer.start()
        except Exception:
            pass
        
    def setup_top_area(self):
        # 顶部容器 - 始终居中上方
        self.top_container = QWidget()
        self.top_container.setFixedHeight(120)
        top_layout = QVBoxLayout(self.top_container)
        top_layout.setAlignment(Qt.AlignCenter)
        # 顶部显示用户名和粉丝总数（用户名位于上方，粉丝数位于中间下方）
        self.username_label = QLabel((self.api_manager.username or ''))
        self.username_label.setAlignment(Qt.AlignCenter)
        # 不在这里固定文字颜色，让主题统一控制文本颜色（便于暗/亮模式切换）
        self.username_label.setStyleSheet("font-size: 28px; font-weight: bold;")
        top_layout.addWidget(self.username_label)

        # 粉丝数显示（动画数字）
        self.animated_number = AnimatedNumberWidget(parent=self.top_container, font_size=48, digit_width=28, digit_height=60)
        # 初始为 0
        self.animated_number.set_value(0)
        top_layout.addWidget(self.animated_number)
        
        self.main_layout.addWidget(self.top_container)
        
        # 设置按钮
        self.settings_btn = QPushButton("⚙️")
        self.settings_btn.setFixedSize(40, 40)
        self.settings_btn.setStyleSheet("""
            QPushButton {
                background-color: transparent;
                border: 2px solid #dfe1e5;
                border-radius: 20px;
                font-size: 16px;
            }
            QPushButton:hover {
                background-color: #f8f9fa;
            }
        """)
        self.settings_btn.clicked.connect(self.open_settings)
        
        # 将设置按钮添加到窗口
        self.settings_btn.setParent(self.central_widget)
        
    def setup_content_area(self):
        # 主内容区域现在为空
        pass
        
    def setup_bottom_area(self):
        # 底部区域现在为空
        pass
        
    def resizeEvent(self, event):
        self.settings_btn.move(self.central_widget.width() - 60, 20)
        super().resizeEvent(event)

    def closeEvent(self, event):
        # 在窗口关闭时停止计时器并尝试优雅停止所有后台线程，避免 QThread: Destroyed while thread '' is still running
        try:
            try:
                if hasattr(self, 'fans_timer'):
                    self.fans_timer.stop()
            except Exception:
                pass

            workers = getattr(self, '_fan_workers', [])[:]
            for w in workers:
                try:
                    if w and getattr(w, 'isRunning', lambda: False)():
                        try:
                            # 尝试终止并等待线程结束（如果线程在网络 IO 上阻塞，terminate 可能是必要手段）
                            w.terminate()
                            w.wait(2000)
                        except Exception:
                            pass
                except Exception:
                    pass
        except Exception:
            pass
        try:
            super().closeEvent(event)
        except Exception:
            event.accept()
        
    def open_settings(self):
        self.settings_window = SettingsWindow(self.api_manager, self)
        self.settings_window.show()

    def fetch_fans(self):
        # 更新界面上的用户名显示
        try:
            self.username_label.setText(self.api_manager.username or '')
        except Exception:
            pass
        # 启动后台线程获取粉丝数
        try:
            # 将线程父对象设为窗口，便于管理生命周期
            worker = FanFetcher(self.api_manager, parent=self)
            worker.fans_ready.connect(self.on_fans_ready)
            worker.error_occurred.connect(self.on_fans_error)
            # 保持引用以避免被回收
            if not hasattr(self, '_fan_workers'):
                self._fan_workers = []
            self._fan_workers.append(worker)
            def _on_done():
                try:
                    if worker in getattr(self, '_fan_workers', []):
                        self._fan_workers.remove(worker)
                except Exception:
                    pass
                try:
                    worker.deleteLater()
                except Exception:
                    pass
            worker.finished.connect(_on_done)
            worker.start()
        except Exception as e:
            try:
                self.api_manager.log_error(f"启动粉丝数获取失败: {repr(e)}")
            except Exception:
                pass

    def on_fans_ready(self, results: dict):
        # results: {name: fans_int}
        try:
            total = sum(int(v) for v in results.values()) if results else 0
        except Exception:
            total = 0
        # 更新动画数字（逐位滚动）
        try:
            self.animated_number.set_value(total)
        except Exception:
            pass

    def on_fans_error(self, message: str):
        try:
            self.api_manager.log_error(f"粉丝获取错误: {message}")
        except Exception:
            pass
            
    def apply_theme(self, theme):
        self.api_manager.theme_mode = theme
        if theme == "light":
            # 统一通过根样式设置颜色，确保 QLabel / QWidget 等继承正确的文字颜色
            self.setStyleSheet("""
                QMainWindow, QWidget { background-color: white; color: black; }
                QLabel { color: black; }
                QPushButton { color: #3c4043; }
                QTableWidget { background-color: white; color: black; }
            """)
            try:
                self.settings_btn.setStyleSheet("""
                    QPushButton {
                        background-color: transparent;
                        border: 2px solid #dfe1e5;
                        border-radius: 20px;
                        font-size: 16px;
                        color: #3c4043;
                    }
                    QPushButton:hover { background-color: #f8f9fa; }
                """)
            except Exception:
                pass
        else:
            # 暗色主题：统一设置背景与文字颜色，确保子控件继承
            self.setStyleSheet("""
                QMainWindow, QWidget { background-color: #202124; color: #e8eaed; }
                QLabel { color: #e8eaed; }
                QPushButton { color: #e8eaed; }
                QTableWidget { background-color: #303134; color: #e8eaed; }
            """)
            try:
                self.settings_btn.setStyleSheet("""
                    QPushButton {
                        background-color: transparent;
                        border: 2px solid #5f6368;
                        border-radius: 20px;
                        font-size: 16px;
                        color: #e8eaed;
                    }
                    QPushButton:hover { background-color: #303134; }
                """)
            except Exception:
                pass

if __name__ == "__main__":
    app = QApplication(sys.argv)
    
    window = MySubWindow()
    window.show()
    
    sys.exit(app.exec())
```

