import random
import json
import requests
import feedparser
from kivymd.app import MDApp
from kivy.lang import Builder
from kivy.uix.screenmanager import ScreenManager, Screen
from kivy.properties import StringProperty, NumericProperty
from kivymd.uix.dialog import MDDialog
from kivymd.uix.button import MDFlatButton, MDRaisedButton
from kivy.clock import Clock
from plyer import notification, gps, camera
from kivy.core.window import Window

# إعدادات الشاشة
Window.size = (360, 640)
# استبدل هذا بالرابط الخاص بك بعد إعداد Firebase
FB_URL = "https://rakobatna-default-rtdb.firebaseio.com"

KV = '''
<ProductCard@MDCard>:
    title: ""
    price: ""
    location: ""
    orientation: "vertical"
    size_hint: None, None
    size: "160dp", "240dp"
    radius: 15
    padding: "8dp"
    elevation: 2
    ripple_behavior: True
    MDIcon:
        icon: "store"
        font_size: "50sp"
        halign: "center"
        theme_text_color: "Custom"
        text_color: 0.13, 0.55, 0.13, 1
    MDLabel:
        text: root.price
        bold: True
        theme_text_color: "Custom"
        text_color: 0.13, 0.55, 0.13, 1
        halign: "right"
    MDLabel:
        text: root.title
        font_style: "Subtitle2"
        halign: "right"
    MDBoxLayout:
        adaptive_height: True
        MDIcon:
            icon: "map-marker"
            font_size: "12sp"
        MDLabel:
            text: root.location
            font_style: "Caption"

<LoginScreen>:
    md_bg_color: 0.95, 0.92, 0.88, 1
    MDBoxLayout:
        orientation: "vertical"
        padding: "25dp"
        spacing: "15dp"
        pos_hint: {"center_y": .5}
        MDIcon:
            icon: "home-group"
            font_size: "90sp"
            halign: "center"
            theme_text_color: "Custom"
            text_color: 0.13, 0.55, 0.13, 1
        MDLabel:
            text: "مرحباً بك في راكوبتنا"
            halign: "center"
            font_style: "H5"
            bold: True
        MDTextField:
            id: user_input
            hint_text: "رقم الهاتف أو البريد"
            mode: "fill"
        MDTextField:
            id: pass_input
            hint_text: "كلمة المرور"
            password: True
            mode: "fill"
        MDRaisedButton:
            text: "دخول"
            size_hint_x: 1
            md_bg_color: 0.13, 0.55, 0.13, 1
            on_release: app.process_login(user_input.text, pass_input.text)

<OTPScreen>:
    md_bg_color: 0.95, 0.92, 0.88, 1
    MDBoxLayout:
        orientation: "vertical"
        padding: "30dp"
        spacing: "20dp"
        pos_hint: {"center_y": .6}
        MDLabel:
            text: "تأكيد الهوية"
            halign: "center"
            font_style: "H5"
        MDTextField:
            id: otp_field
            hint_text: "أدخل الرمز المرسل"
            halign: "center"
            font_size: "24sp"
        MDRaisedButton:
            text: "تأكيد"
            size_hint_x: 0.8
            pos_hint: {"center_x": .5}
            md_bg_color: 0.13, 0.55, 0.13, 1
            on_release: app.verify_otp(otp_field.text)

<MainAppScreen>:
    MDBoxLayout:
        orientation: "vertical"
        MDTopAppBar:
            title: "راكوبتنا"
            md_bg_color: 0.13, 0.55, 0.13, 1
            right_action_items: [["crosshairs-gps", lambda x: app.get_location()], ["logout", lambda x: app.logout()]]

        MDBottomNavigation:
            text_color_active: 0.13, 0.55, 0.13, 1
            
            MDBottomNavigationItem:
                name: 'market'
                text: 'السوق'
                icon: 'storefront-outline'
                MDFloatLayout:
                    ScrollView:
                        MDGridLayout:
                            id: market_grid
                            cols: 2
                            adaptive_height: True
                            padding: "10dp"
                            spacing: "10dp"
                    MDFloatingActionButton:
                        icon: "plus"
                        md_bg_color: 0.13, 0.55, 0.13, 1
                        pos_hint: {"center_x": .15, "center_y": .1}
                        on_release: app.open_add_item_dialog()

            MDBottomNavigationItem:
                name: 'extras'
                text: 'المنوعات'
                icon: 'grid-large'
                MDBoxLayout:
                    orientation: "vertical"
                    padding: "15dp"
                    spacing: "15dp"
                    MDCard:
                        size_hint_y: None
                        height: "80dp"
                        md_bg_color: 0.13, 0.55, 0.13, 0.1
                        padding: "10dp"
                        MDLabel:
                            text: app.user_location
                            halign: "center"
                            theme_text_color: "Secondary"
                    MDRaisedButton:
                        text: "الخبر الأكيد (عاجل)"
                        size_hint_x: 1
                        md_bg_color: 0.13, 0.55, 0.13, 1
                        on_release: app.show_news_dialog()

            MDBottomNavigationItem:
                name: 'profile'
                text: 'أنا'
                icon: 'account-circle-outline'
                MDBoxLayout:
                    orientation: "vertical"
                    padding: "20dp"
                    spacing: "10dp"
                    MDIcon:
                        icon: "account-circle"
                        font_size: "80sp"
                        halign: "center"
                    MDTextField:
                        id: profile_name
                        text: app.user_name
                        hint_text: "الاسم"
                    MDRaisedButton:
                        text: "تحديث الملف"
                        pos_hint: {"center_x": .5}
                        on_release: app.save_profile(profile_name.text)

ScreenManager:
    LoginScreen:
        name: "login_screen"
    OTPScreen:
        name: "otp_screen"
    MainAppScreen:
        name: "main_app"
'''

class RakobatnaApp(MDApp):
    user_name = StringProperty("زول الراكوبة")
    user_location = StringProperty("الموقع: بورتسودان (تلقائي)")
    current_otp = StringProperty("")

    def build(self):
        self.theme_cls.primary_palette = "Green"
        self.root_sm = Builder.load_string(KV)
        return self.root_sm

    def on_start(self):
        # تشغيل الخدمات عند البدء
        self.load_market_data()
        Clock.schedule_interval(self.check_new_items, 30) # فحص السلع كل 30 ثانية

    # --- ميزة الـ GPS ---
    def get_location(self):
        try:
            gps.configure(on_location=self.on_location)
            gps.start()
            self.send_notif("GPS", "جاري البحث عن موقعك...")
        except:
            self.show_dialog("تنبيه", "تأكد من تفعيل الـ GPS في هاتفك.")

    def on_location(self, **kwargs):
        lat, lon = kwargs.get('lat'), kwargs.get('lon')
        self.user_location = f"إحداثياتك: {lat}, {lon}"
        # تحديث الموقع في Firebase لربط السلع بمكانك
        requests.patch(f"{FB_URL}/users/{self.user_name}.json", data=json.dumps({"lat": lat, "lon": lon}))

    # --- التنبيهات ---
    def send_notif(self, title, msg):
        try:
            notification.notify(title=title, message=msg, app_name="Rakobatna")
        except: pass

    def check_new_items(self, dt):
        # محاكاة لفحص السلع الجديدة وإرسال تنبيه
        pass

    # --- العمليات الأساسية ---
    def process_login(self, user, pwd):
        if user and len(pwd) >= 6:
            self.user_name = user
            self.current_otp = str(random.randint(1000, 9999))
            self.show_dialog("رمز التحقق", f"كود دخولك هو: {self.current_otp}")
            self.root_sm.current = "otp_screen"

    def verify_otp(self, code):
        if code == self.current_otp:
            self.root_sm.current = "main_app"
            self.get_location() # جلب الموقع فور الدخول

    def load_market_data(self):
        try:
            r = requests.get(f"{FB_URL}/market.json")
            items = r.json()
            if items:
                grid = self.root_sm.get_screen("main_app").ids.market_grid
                grid.clear_widgets()
                for i in items:
                    val = items[i]
                    # إنشاء بطاقة سلعة وإضافتها
                    from kivymd.uix.card import MDCard
                    grid.add_widget(MDCard(line_color=(0,0,0,0.1), padding=10)) # مثال مبسط
        except: pass

    def show_news_dialog(self):
        feed = feedparser.parse("https://www.aljazeera.net/alritem/rss/rss.xml")
        news = "".join([f"• {e.title}\\n\\n" for e in feed.entries[:3]])
        self.show_dialog("الخبر الأكيد", news)

    def show_dialog(self, title, text):
        self.dialog = MDDialog(title=title, text=text,
            buttons=[MDFlatButton(text="حسناً", on_release=lambda x: self.dialog.dismiss())])
        self.dialog.open()

    def logout(self):
        self.root_sm.current = "login_screen"

if __name__ == "__main__":
    RakobatnaApp().run()