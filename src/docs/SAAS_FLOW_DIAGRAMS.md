# 🎯 مخططات تدفق منصة SmartDine SaaS

## 📋 جدول المحتويات
1. [التدفق العام للمنصة](#التدفق-العام-للمنصة)
2. [تدفق تسجيل المطعم](#تدفق-تسجيل-المطعم)
3. [تدفق طلب العميل](#تدفق-طلب-العميل)
4. [تدفق معالجة الطلب](#تدفق-معالجة-الطلب)
5. [تدفق مساعد AI](#تدفق-مساعد-ai)
6. [تدفق AR Viewer](#تدفق-ar-viewer)
7. [تدفق إدارة القائمة](#تدفق-إدارة-القائمة)
8. [تدفق الدفع والاشتراك](#تدفق-الدفع-والاشتراك)
9. [بنية النظام الكاملة](#بنية-النظام-الكاملة)

---

## 1️⃣ التدفق العام للمنصة

```mermaid
graph TB
    Start([زائر يدخل الموقع]) --> Choice{نوع المستخدم؟}
    
    Choice -->|مطعم جديد| Register[التسجيل كمطعم]
    Choice -->|مطعم موجود| Login[تسجيل الدخول]
    Choice -->|عميل| QR[مسح QR Code]
    
    Register --> Setup[إعداد المطعم]
    Setup --> Subscribe[اختيار الباقة]
    Subscribe --> Dashboard[لوحة التحكم]
    
    Login --> Dashboard
    
    Dashboard --> ManageMenu[إدارة القائمة]
    Dashboard --> ViewOrders[عرض الطلبات]
    Dashboard --> Analytics[التحليلات]
    Dashboard --> Settings[الإعدادات]
    
    QR --> Menu[عرض القائمة]
    Menu --> Browse[تصفح الأطباق]
    Browse --> AI{استخدام AI؟}
    AI -->|نعم| AIAssist[مساعد AI]
    AI -->|لا| AddCart[إضافة للسلة]
    AIAssist --> AddCart
    
    AddCart --> Cart[السلة]
    Cart --> Checkout[الدفع]
    Checkout --> OrderPlaced[تأكيد الطلب]
    
    OrderPlaced --> Kitchen[المطبخ]
    Kitchen --> Prepare[التحضير]
    Prepare --> Ready[جاهز]
    Ready --> Deliver[التوصيل/التقديم]
    Deliver --> Rate[تقييم]
    
    Rate --> End([انتهاء])
    
    style Start fill:#0B1E3A,color:#fff
    style End fill:#0B1E3A,color:#fff
    style Dashboard fill:#162A52,color:#fff
    style OrderPlaced fill:#10B981,color:#fff
    style Kitchen fill:#F59E0B,color:#000
```

---

## 2️⃣ تدفق تسجيل المطعم

```mermaid
graph LR
    A([البداية]) --> B[زيارة الموقع]
    B --> C[الضغط على 'ابدأ الآن']
    C --> D{لديه حساب؟}
    
    D -->|نعم| E[تسجيل الدخول]
    D -->|لا| F[ملء نموذج التسجيل]
    
    F --> G[إدخال معلومات المطعم]
    G --> H[رفع الشعار]
    H --> I[اختيار الباقة]
    
    I --> J{نوع الباقة؟}
    J -->|Basic| K[29$/شهر]
    J -->|Pro| L[79$/شهر]
    J -->|Enterprise| M[199$/شهر]
    
    K --> N[إدخال بيانات الدفع]
    L --> N
    M --> N
    
    N --> O[تأكيد الدفع]
    O --> P{الدفع ناجح؟}
    
    P -->|نعم| Q[تفعيل الحساب]
    P -->|لا| N
    
    Q --> R[إرسال بريد ترحيبي]
    R --> S[الدخول للوحة التحكم]
    
    E --> S
    
    S --> T[جولة تعريفية]
    T --> U[إضافة القائمة]
    U --> V[طباعة QR Codes]
    V --> W([جاهز للاستخدام])
    
    style A fill:#0B1E3A,color:#fff
    style W fill:#10B981,color:#fff
    style Q fill:#10B981,color:#fff
```

---

## 3️⃣ تدفق طلب العميل (Customer Order Flow)

```mermaid
graph TB
    Start([العميل في المطعم]) --> Scan[مسح QR Code على الطاولة]
    Scan --> Load[تحميل القائمة الرقمية]
    Load --> View[عرض القائمة]
    
    View --> Browse{تصفح الأطباق}
    Browse --> Categories[اختيار التصنيف]
    Categories --> DishList[عرض الأطباق]
    
    DishList --> DishDetail[تفاصيل الطبق]
    DishDetail --> Actions{ماذا تريد؟}
    
    Actions -->|معلومات أكثر| AI[سؤال AI]
    Actions -->|رؤية الطبق| AR[عرض AR]
    Actions -->|طلب مباشر| Add[إضافة للسلة]
    
    AI --> AIChat[محادثة مع AI]
    AIChat --> Recommend[توصيات AI]
    Recommend --> Add
    
    AR --> ARView[عرض 3D]
    ARView --> Rotate[تدوير ومعاينة]
    Rotate --> Add
    
    Add --> Cart[السلة]
    Cart --> Review{مراجعة الطلب}
    
    Review -->|إضافة المزيد| Browse
    Review -->|تعديل| Edit[تعديل الكميات]
    Review -->|جاهز| Checkout[الدفع]
    
    Edit --> Cart
    
    Checkout --> PayMethod{طريقة الدفع}
    PayMethod -->|بطاقة| Card[الدفع بالبطاقة]
    PayMethod -->|نقدي| Cash[الدفع نقداً]
    PayMethod -->|Apple Pay| Apple[Apple Pay]
    
    Card --> Process[معالجة الدفع]
    Apple --> Process
    Cash --> Skip[تخطي الدفع]
    
    Process --> Confirm[تأكيد الطلب]
    Skip --> Confirm
    
    Confirm --> Notify[إشعار المطعم]
    Notify --> Track[تتبع الطلب]
    
    Track --> Status{حالة الطلب}
    Status -->|قيد التحضير| Wait1[انتظار...]
    Status -->|جاهز| Ready[الطلب جاهز!]
    Status -->|في الطريق| Wait2[انتظار التوصيل...]
    
    Wait1 --> Status
    Wait2 --> Delivered
    
    Ready --> Receive[استلام الطلب]
    Receive --> Enjoy[الاستمتاع بالطعام]
    
    Delivered[تم التوصيل] --> Enjoy
    
    Enjoy --> Rating[تقييم التجربة]
    Rating --> Review2[كتابة مراجعة]
    Review2 --> End([شكراً لك!])
    
    style Start fill:#0B1E3A,color:#fff
    style End fill:#10B981,color:#fff
    style Confirm fill:#10B981,color:#fff
    style Ready fill:#10B981,color:#fff
```

---

## 4️⃣ تدفق معالجة الطلب (Order Processing)

```mermaid
sequenceDiagram
    participant C as العميل
    participant QR as QR Menu
    participant API as Backend API
    participant DB as Database
    participant R as المطعم
    participant K as المطبخ
    participant D as التوصيل
    
    C->>QR: مسح QR Code
    QR->>API: طلب القائمة
    API->>DB: جلب القائمة
    DB-->>API: بيانات القائمة
    API-->>QR: عرض القائمة
    QR-->>C: عرض الأطباق
    
    C->>QR: إضافة أطباق للسلة
    C->>QR: تأكيد الطلب
    QR->>API: إرسال الطلب
    API->>DB: حفظ الطلب
    
    API->>R: إشعار طلب جديد 🔔
    API->>K: إرسال للمطبخ 👨‍🍳
    
    R->>API: قبول الطلب ✅
    API->>C: تأكيد القبول
    
    K->>API: بدء التحضير 🔥
    API->>C: إشعار: قيد التحضير
    
    K->>API: الطلب جاهز ✅
    API->>C: إشعار: الطلب جاهز!
    API->>D: تعيين للتوصيل 🚗
    
    D->>API: استلام الطلب
    D->>API: في الطريق 📍
    API->>C: إشعار: في الطريق
    
    D->>API: تم التوصيل ✅
    API->>C: إشعار: تم التوصيل
    
    C->>API: تقييم الطلب ⭐
    API->>DB: حفظ التقييم
    API->>R: إشعار بالتقييم
```



---

## 5️⃣ تدفق مساعد AI (AI Assistant Flow)

```mermaid
graph TB
    Start([العميل يفتح AI]) --> Welcome[رسالة ترحيب من AI]
    Welcome --> Input[العميل يكتب سؤال]
    
    Input --> Analyze[AI يحلل السؤال]
    Analyze --> Type{نوع السؤال؟}
    
    Type -->|توصية| Recommend[AI يقترح أطباق]
    Type -->|معلومات| Info[AI يشرح الطبق]
    Type -->|حساسية| Allergy[AI يفلتر الأطباق]
    Type -->|سعرات| Calories[AI يعرض السعرات]
    Type -->|عام| General[AI يجيب]
    
    Recommend --> Context{السياق}
    Context -->|ميزانية| Budget[أطباق بسعر محدد]
    Context -->|نوع| Cuisine[نوع مطبخ معين]
    Context -->|صحي| Healthy[خيارات صحية]
    Context -->|شعبي| Popular[الأكثر طلباً]
    
    Budget --> Suggest[عرض الاقتراحات]
    Cuisine --> Suggest
    Healthy --> Suggest
    Popular --> Suggest
    
    Info --> Details[تفاصيل المكونات]
    Allergy --> Filter[فلترة حسب الحساسية]
    Calories --> NutritionInfo[معلومات غذائية]
    General --> Answer[إجابة عامة]
    
    Suggest --> Display[عرض الأطباق المقترحة]
    Details --> Display
    Filter --> Display
    NutritionInfo --> Display
    Answer --> Display
    
    Display --> Satisfied{راضي عن الإجابة؟}
    
    Satisfied -->|لا| FollowUp[سؤال إضافي]
    Satisfied -->|نعم| Action{ماذا تريد؟}
    
    FollowUp --> Input
    
    Action -->|إضافة للسلة| AddToCart[إضافة الطبق]
    Action -->|معلومات أكثر| ViewDish[عرض تفاصيل]
    Action -->|سؤال آخر| Input
    Action -->|إنهاء| End([إغلاق AI])
    
    AddToCart --> Cart[السلة]
    ViewDish --> DishPage[صفحة الطبق]
    
    Cart --> End
    DishPage --> End
    
    style Start fill:#0B1E3A,color:#fff
    style End fill:#0B1E3A,color:#fff
    style Suggest fill:#10B981,color:#fff
    style Display fill:#3B82F6,color:#fff
```

---

## 6️⃣ تدفق AR Viewer (AR Experience Flow)

```mermaid
graph LR
    A([اختيار طبق]) --> B[الضغط على 'عرض AR']
    B --> C{دعم AR؟}
    
    C -->|لا| D[رسالة خطأ]
    C -->|نعم| E[طلب صلاحية الكاميرا]
    
    D --> Z([العودة للقائمة])
    
    E --> F{الصلاحية ممنوحة؟}
    F -->|لا| D
    F -->|نعم| G[تحميل نموذج 3D]
    
    G --> H[تهيئة AR Session]
    H --> I[البحث عن سطح]
    
    I --> J{سطح مكتشف؟}
    J -->|لا| K[رسالة: وجه الكاميرا للطاولة]
    J -->|نعم| L[وضع الطبق على السطح]
    
    K --> I
    
    L --> M[عرض الطبق 3D]
    M --> N[تفاعل المستخدم]
    
    N --> O{نوع التفاعل}
    O -->|تدوير| P[تدوير الطبق]
    O -->|تكبير| Q[تكبير/تصغير]
    O -->|معلومات| R[عرض المكونات]
    O -->|إضافة| S[إضافة للسلة]
    O -->|إغلاق| T[إنهاء AR]
    
    P --> N
    Q --> N
    R --> N
    
    S --> U[تأكيد الإضافة]
    U --> V([العودة للقائمة])
    
    T --> V
    
    style A fill:#0B1E3A,color:#fff
    style M fill:#10B981,color:#fff
    style S fill:#10B981,color:#fff
```

---

## 7️⃣ تدفق إدارة القائمة (Menu Management)

```mermaid
graph TB
    Start([لوحة التحكم]) --> Menu[قسم القائمة]
    Menu --> View[عرض القائمة الحالية]
    
    View --> Action{ماذا تريد؟}
    
    Action -->|إضافة طبق| Add[إضافة طبق جديد]
    Action -->|تعديل| Edit[تعديل طبق]
    Action -->|حذف| Delete[حذف طبق]
    Action -->|تنظيم| Organize[تنظيم التصنيفات]
    
    Add --> Form[نموذج الطبق]
    Form --> Fill[ملء البيانات]
    Fill --> Details[إدخال التفاصيل]
    
    Details --> Name[الاسم عربي/إنجليزي]
    Details --> Desc[الوصف]
    Details --> Price[السعر]
    Details --> Category[التصنيف]
    Details --> Ingredients[المكونات]
    Details --> Nutrition[معلومات غذائية]
    
    Name --> Upload[رفع الصورة]
    Desc --> Upload
    Price --> Upload
    Category --> Upload
    Ingredients --> Upload
    Nutrition --> Upload
    
    Upload --> Optional{إضافات اختيارية؟}
    Optional -->|نموذج 3D| Model[رفع نموذج 3D]
    Optional -->|لا| Validate
    
    Model --> Validate[التحقق من البيانات]
    
    Validate --> Valid{البيانات صحيحة؟}
    Valid -->|لا| Error[عرض الأخطاء]
    Valid -->|نعم| Save[حفظ الطبق]
    
    Error --> Fill
    
    Save --> Publish{نشر مباشرة؟}
    Publish -->|نعم| Live[نشر في القائمة]
    Publish -->|لا| Draft[حفظ كمسودة]
    
    Live --> Success[تم النشر بنجاح]
    Draft --> Success
    
    Edit --> SelectDish[اختيار الطبق]
    SelectDish --> EditForm[تعديل البيانات]
    EditForm --> Save
    
    Delete --> Confirm{تأكيد الحذف؟}
    Confirm -->|نعم| Remove[حذف الطبق]
    Confirm -->|لا| View
    Remove --> Success
    
    Organize --> Categories[إدارة التصنيفات]
    Categories --> Reorder[إعادة الترتيب]
    Reorder --> SaveOrder[حفظ الترتيب]
    SaveOrder --> Success
    
    Success --> Notify[إشعار النجاح]
    Notify --> End([العودة للقائمة])
    
    style Start fill:#0B1E3A,color:#fff
    style Success fill:#10B981,color:#fff
    style Live fill:#10B981,color:#fff
```

---

## 8️⃣ تدفق الدفع والاشتراك (Payment & Subscription)

```mermaid
graph TB
    Start([اختيار الباقة]) --> Plans[عرض الباقات]
    Plans --> Compare[مقارنة المميزات]
    
    Compare --> Select{اختيار الباقة}
    Select -->|Basic| Basic[29$/شهر]
    Select -->|Pro| Pro[79$/شهر]
    Select -->|Enterprise| Enterprise[199$/شهر]
    
    Basic --> Period{فترة الدفع}
    Pro --> Period
    Enterprise --> Period
    
    Period -->|شهري| Monthly[دفع شهري]
    Period -->|سنوي| Yearly[دفع سنوي - خصم 20%]
    
    Monthly --> Calculate[حساب المبلغ]
    Yearly --> Calculate
    
    Calculate --> Summary[ملخص الفاتورة]
    Summary --> PaymentMethod{طريقة الدفع}
    
    PaymentMethod -->|بطاقة ائتمان| Card[إدخال بيانات البطاقة]
    PaymentMethod -->|PayPal| PayPal[تسجيل دخول PayPal]
    PaymentMethod -->|تحويل بنكي| Transfer[معلومات التحويل]
    
    Card --> CardDetails[رقم البطاقة، CVV، تاريخ]
    CardDetails --> Process
    
    PayPal --> PayPalAuth[مصادقة PayPal]
    PayPalAuth --> Process
    
    Transfer --> BankInfo[عرض معلومات الحساب]
    BankInfo --> Manual[انتظار التأكيد اليدوي]
    
    Process[معالجة الدفع] --> Verify{التحقق}
    
    Verify -->|فشل| Failed[فشل الدفع]
    Verify -->|نجح| Success[نجح الدفع]
    
    Failed --> Retry{المحاولة مرة أخرى؟}
    Retry -->|نعم| PaymentMethod
    Retry -->|لا| Cancel([إلغاء])
    
    Success --> Activate[تفعيل الاشتراك]
    Manual --> Activate
    
    Activate --> Invoice[إصدار فاتورة]
    Invoice --> Email[إرسال بريد تأكيد]
    Email --> Features[تفعيل المميزات]
    
    Features --> Dashboard[الدخول للوحة التحكم]
    Dashboard --> AutoRenew[تفعيل التجديد التلقائي]
    
    AutoRenew --> Reminder[تذكير قبل التجديد]
    Reminder --> End([اكتمل])
    
    style Start fill:#0B1E3A,color:#fff
    style Success fill:#10B981,color:#fff
    style Failed fill:#EF4444,color:#fff
    style End fill:#10B981,color:#fff
```

---

## 9️⃣ بنية النظام الكاملة (System Architecture)

```mermaid
graph TB
    subgraph "Frontend Layer"
        Web[Web App<br/>React + TypeScript]
        Mobile[Mobile App<br/>React Native]
        QRMenu[QR Menu<br/>PWA]
    end
    
    subgraph "API Gateway"
        Gateway[API Gateway<br/>Load Balancer]
    end
    
    subgraph "Backend Services"
        Auth[Auth Service<br/>JWT + OAuth]
        Order[Order Service<br/>WebSocket]
        Menu[Menu Service<br/>REST API]
        Payment[Payment Service<br/>Stripe]
        AI[AI Service<br/>OpenAI API]
        Analytics[Analytics Service<br/>Data Processing]
        Notification[Notification Service<br/>Push + Email]
    end
    
    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL<br/>Main Database)]
        Redis[(Redis<br/>Cache + Sessions)]
        S3[(S3/R2<br/>File Storage)]
        ElasticSearch[(ElasticSearch<br/>Search Engine)]
    end
    
    subgraph "External Services"
        Stripe[Stripe<br/>Payments]
        Twilio[Twilio<br/>SMS]
        SendGrid[SendGrid<br/>Email]
        OpenAI[OpenAI<br/>AI Models]
        Maps[Google Maps<br/>Location]
    end
    
    Web --> Gateway
    Mobile --> Gateway
    QRMenu --> Gateway
    
    Gateway --> Auth
    Gateway --> Order
    Gateway --> Menu
    Gateway --> Payment
    Gateway --> AI
    Gateway --> Analytics
    Gateway --> Notification
    
    Auth --> PostgreSQL
    Auth --> Redis
    
    Order --> PostgreSQL
    Order --> Redis
    
    Menu --> PostgreSQL
    Menu --> S3
    Menu --> ElasticSearch
    
    Payment --> PostgreSQL
    Payment --> Stripe
    
    AI --> OpenAI
    AI --> PostgreSQL
    
    Analytics --> PostgreSQL
    Analytics --> ElasticSearch
    
    Notification --> Twilio
    Notification --> SendGrid
    Notification --> Redis
    
    style Web fill:#3B82F6,color:#fff
    style Mobile fill:#3B82F6,color:#fff
    style QRMenu fill:#3B82F6,color:#fff
    style Gateway fill:#8B5CF6,color:#fff
    style PostgreSQL fill:#0B1E3A,color:#fff
    style Redis fill:#DC2626,color:#fff
```



---

## 🔟 تدفق لوحة التحكم (Dashboard Flow)

```mermaid
graph TB
    Login([تسجيل الدخول]) --> Dashboard[لوحة التحكم الرئيسية]
    
    Dashboard --> Overview[نظرة عامة]
    Overview --> Stats[إحصائيات اليوم]
    Stats --> Sales[المبيعات: 5,240 ريال]
    Stats --> Orders[الطلبات: 87]
    Stats --> Customers[العملاء: 124]
    Stats --> Rating[التقييم: 4.7⭐]
    
    Dashboard --> LiveOrders[الطلبات الحية]
    LiveOrders --> OrderList[قائمة الطلبات]
    OrderList --> OrderCard[بطاقة طلب]
    OrderCard --> OrderActions{إجراءات}
    OrderActions -->|قبول| Accept[قبول الطلب]
    OrderActions -->|رفض| Reject[رفض الطلب]
    OrderActions -->|تفاصيل| Details[عرض التفاصيل]
    
    Dashboard --> MenuMgmt[إدارة القائمة]
    MenuMgmt --> AddDish[إضافة طبق]
    MenuMgmt --> EditDish[تعديل طبق]
    MenuMgmt --> Categories[إدارة التصنيفات]
    
    Dashboard --> AnalyticsView[التحليلات]
    AnalyticsView --> Charts[الرسوم البيانية]
    Charts --> SalesChart[مبيعات الشهر]
    Charts --> PopularDishes[الأطباق الأكثر طلباً]
    Charts --> PeakHours[أوقات الذروة]
    Charts --> CustomerBehavior[سلوك العملاء]
    
    Dashboard --> Staff[إدارة الموظفين]
    Staff --> AddStaff[إضافة موظف]
    Staff --> Roles[تعيين الصلاحيات]
    Staff --> Schedule[جدول العمل]
    
    Dashboard --> Settings[الإعدادات]
    Settings --> RestaurantInfo[معلومات المطعم]
    Settings --> Subscription[إدارة الاشتراك]
    Settings --> Notifications[إعدادات الإشعارات]
    Settings --> Integration[التكاملات]
    
    Dashboard --> Support[الدعم الفني]
    Support --> Tickets[التذاكر]
    Support --> Chat[الدردشة المباشرة]
    Support --> Docs[الوثائق]
    
    style Dashboard fill:#0B1E3A,color:#fff
    style Overview fill:#162A52,color:#fff
    style LiveOrders fill:#F59E0B,color:#000
    style AnalyticsView fill:#3B82F6,color:#fff
```

---

## 1️⃣1️⃣ تدفق المطبخ (Kitchen Dashboard Flow)

```mermaid
graph LR
    A([طلب جديد يصل]) --> B[🔔 إشعار صوتي]
    B --> C[عرض الطلب]
    C --> D[تفاصيل الطلب]
    
    D --> E[رقم الطاولة: 12]
    D --> F[الأطباق المطلوبة]
    D --> G[ملاحظات خاصة]
    D --> H[وقت الطلب]
    
    E --> I{قبول الطلب؟}
    F --> I
    G --> I
    H --> I
    
    I -->|نعم| J[بدء التحضير]
    I -->|رفض| K[سبب الرفض]
    
    K --> L[إشعار العميل]
    L --> M([إنهاء])
    
    J --> N[تحديث الحالة: قيد التحضير]
    N --> O[مؤقت التحضير]
    O --> P[العمل على الطلب]
    
    P --> Q{الطلب جاهز؟}
    Q -->|لا| P
    Q -->|نعم| R[تحديث: جاهز ✅]
    
    R --> S[إشعار العميل]
    R --> T[إشعار التوصيل/الخادم]
    
    S --> U[الطلب التالي]
    T --> U
    U --> A
    
    style A fill:#0B1E3A,color:#fff
    style J fill:#F59E0B,color:#000
    style R fill:#10B981,color:#fff
```

---

## 1️⃣2️⃣ تدفق التوصيل (Delivery Flow)

```mermaid
graph TB
    Start([طلب جاهز للتوصيل]) --> Assign[تعيين للسائق]
    Assign --> Notify[إشعار السائق]
    
    Notify --> Accept{قبول السائق؟}
    Accept -->|لا| Reassign[إعادة التعيين]
    Accept -->|نعم| Pickup[التوجه للمطعم]
    
    Reassign --> Assign
    
    Pickup --> Arrived[الوصول للمطعم]
    Arrived --> Collect[استلام الطلب]
    Collect --> Verify[التحقق من الطلب]
    
    Verify --> Complete{الطلب كامل؟}
    Complete -->|لا| Report[الإبلاغ عن مشكلة]
    Complete -->|نعم| StartDelivery[بدء التوصيل]
    
    Report --> Resolve[حل المشكلة]
    Resolve --> StartDelivery
    
    StartDelivery --> Navigate[التنقل للعنوان]
    Navigate --> GPS[تتبع GPS]
    GPS --> UpdateLocation[تحديث الموقع]
    
    UpdateLocation --> CustomerNotify[إشعار العميل بالموقع]
    CustomerNotify --> Approaching[الاقتراب من الوجهة]
    
    Approaching --> ArrivedCustomer[الوصول للعميل]
    ArrivedCustomer --> Contact[الاتصال بالعميل]
    
    Contact --> Handover[تسليم الطلب]
    Handover --> Confirm[تأكيد الاستلام]
    
    Confirm --> Payment{الدفع نقداً؟}
    Payment -->|نعم| CollectCash[تحصيل المبلغ]
    Payment -->|لا| Skip[تخطي]
    
    CollectCash --> Complete2[إكمال التوصيل]
    Skip --> Complete2
    
    Complete2 --> Rate[طلب تقييم]
    Rate --> Photo[التقاط صورة التسليم]
    Photo --> Submit[إرسال التأكيد]
    
    Submit --> NextOrder{طلب آخر؟}
    NextOrder -->|نعم| Start
    NextOrder -->|لا| End([إنهاء الوردية])
    
    style Start fill:#0B1E3A,color:#fff
    style StartDelivery fill:#F59E0B,color:#000
    style Complete2 fill:#10B981,color:#fff
    style End fill:#0B1E3A,color:#fff
```

---

## 1️⃣3️⃣ تدفق التقييمات (Rating & Review Flow)

```mermaid
graph LR
    A([الطلب مكتمل]) --> B[طلب تقييم]
    B --> C{العميل يريد التقييم؟}
    
    C -->|لا| D[تخطي]
    C -->|نعم| E[نموذج التقييم]
    
    D --> Z([إنهاء])
    
    E --> F[تقييم النجوم]
    F --> G[1-5 نجوم]
    
    G --> H{التقييم}
    H -->|1-2 نجوم| I[نموذج تفصيلي]
    H -->|3 نجوم| J[تعليق اختياري]
    H -->|4-5 نجوم| K[شكر + تعليق اختياري]
    
    I --> L[ما المشكلة؟]
    L --> M[اختيار من قائمة]
    M --> N[تفاصيل إضافية]
    
    J --> O[كتابة تعليق]
    K --> O
    N --> O
    
    O --> P[إرسال التقييم]
    P --> Q[حفظ في قاعدة البيانات]
    
    Q --> R[إشعار المطعم]
    R --> S[تحديث متوسط التقييم]
    
    S --> T{تقييم سيء؟}
    T -->|نعم| U[إشعار عاجل للمدير]
    T -->|لا| V[إشعار عادي]
    
    U --> W[رد المطعم]
    V --> W
    
    W --> X[شكر العميل]
    X --> Z
    
    style A fill:#0B1E3A,color:#fff
    style P fill:#10B981,color:#fff
    style U fill:#EF4444,color:#fff
```

---

## 1️⃣4️⃣ خريطة رحلة المستخدم (User Journey Map)

```mermaid
journey
    title رحلة العميل في SmartDine
    section الوصول للمطعم
      الجلوس على الطاولة: 5: العميل
      رؤية QR Code: 5: العميل
      مسح الرمز: 4: العميل
    section تصفح القائمة
      فتح القائمة الرقمية: 5: العميل
      تصفح الأطباق: 5: العميل
      مشاهدة الصور: 5: العميل
      قراءة الأوصاف: 4: العميل
    section استخدام AI
      فتح مساعد AI: 5: العميل
      طرح سؤال: 5: العميل
      الحصول على توصية: 5: العميل, AI
      الإعجاب بالاقتراح: 5: العميل
    section الطلب
      إضافة للسلة: 5: العميل
      مراجعة الطلب: 4: العميل
      تأكيد الطلب: 5: العميل
      الدفع: 4: العميل
    section الانتظار
      تتبع الطلب: 4: العميل
      استلام إشعارات: 5: العميل, النظام
      الطلب جاهز: 5: المطبخ
    section الاستمتاع
      استلام الطلب: 5: العميل, الخادم
      تناول الطعام: 5: العميل
      الرضا عن الجودة: 5: العميل
    section التقييم
      تقييم التجربة: 4: العميل
      كتابة مراجعة: 3: العميل
      شكر من المطعم: 5: المطعم
```

---

## 1️⃣5️⃣ مخطط حالات الطلب (Order State Diagram)

```mermaid
stateDiagram-v2
    [*] --> Created: عميل يضع طلب
    
    Created --> Pending: إرسال للمطعم
    Pending --> Accepted: المطعم يقبل
    Pending --> Rejected: المطعم يرفض
    
    Rejected --> [*]: إشعار العميل
    
    Accepted --> Preparing: إرسال للمطبخ
    Preparing --> Ready: الطلب جاهز
    
    Ready --> PickedUp: استلام للتوصيل
    Ready --> Served: تقديم في المطعم
    
    PickedUp --> InTransit: في الطريق
    InTransit --> Delivered: تم التوصيل
    
    Served --> Completed: العميل انتهى
    Delivered --> Completed: تأكيد الاستلام
    
    Completed --> Rated: العميل يقيّم
    Rated --> [*]: إنهاء
    
    Created --> Cancelled: إلغاء العميل
    Pending --> Cancelled: إلغاء العميل
    Accepted --> Cancelled: إلغاء المطعم
    
    Cancelled --> [*]: رد المبلغ
    
    note right of Preparing
        المطبخ يعمل
        مؤقت نشط
    end note
    
    note right of InTransit
        تتبع GPS
        إشعارات للعميل
    end note
```

---

## 📊 ملخص المخططات

### المخططات المتوفرة:
1. ✅ **التدفق العام** - نظرة شاملة على المنصة
2. ✅ **تسجيل المطعم** - من التسجيل للتشغيل
3. ✅ **طلب العميل** - رحلة الطلب الكاملة
4. ✅ **معالجة الطلب** - Sequence Diagram
5. ✅ **مساعد AI** - تفاعل الذكاء الاصطناعي
6. ✅ **AR Viewer** - تجربة الواقع المعزز
7. ✅ **إدارة القائمة** - إضافة وتعديل الأطباق
8. ✅ **الدفع والاشتراك** - معالجة المدفوعات
9. ✅ **بنية النظام** - Architecture Overview
10. ✅ **لوحة التحكم** - Dashboard Navigation
11. ✅ **المطبخ** - Kitchen Operations
12. ✅ **التوصيل** - Delivery Process
13. ✅ **التقييمات** - Rating System
14. ✅ **رحلة المستخدم** - User Journey
15. ✅ **حالات الطلب** - State Machine

---

## 🎨 كيفية عرض المخططات

### في GitHub/GitLab
المخططات ستظهر تلقائياً عند عرض الملف

### في VS Code
1. تثبيت إضافة: **Markdown Preview Mermaid Support**
2. فتح الملف والضغط على Preview

### في المتصفح
1. نسخ كود Mermaid
2. الذهاب إلى: https://mermaid.live
3. لصق الكود ومشاهدة المخطط

### تصدير كصور
1. استخدام Mermaid Live Editor
2. تصدير كـ PNG/SVG
3. استخدام في العروض التقديمية

---

## 🔗 روابط مفيدة

- [Mermaid Documentation](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live)
- [SmartDine PRD](./src/docs/SmartDine_SaaS_PRD.md)
- [دليل الاستخدام](./SAAS_USAGE_GUIDE.md)

---

*تم إنشاؤه بواسطة: SmartDine Team*  
*آخر تحديث: فبراير 2026*  
*الإصدار: 1.0*
