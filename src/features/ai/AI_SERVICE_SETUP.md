# AI Service Setup Guide

## ✅ تم إعداد خدمة الذكاء الاصطناعي بنجاح!

تم إضافة مفتاح OpenAI API وإعداد الخدمة بالكامل.

## 📋 ما تم إنجازه

### 1. إضافة مفتاح OpenAI API
- ✅ تم إضافة المفتاح إلى `.env.development`
- ✅ تم تحديث `.env.example` بالتعليمات
- ✅ المفتاح جاهز للاستخدام

### 2. إنشاء AI Service
- ✅ `services/aiService.ts` - خدمة التواصل مع OpenAI
- ✅ دعم GPT-4
- ✅ معالجة الأخطاء
- ✅ استخراج اقتراحات الأطباق

### 3. إنشاء React Query Hooks
- ✅ `hooks/useAIChat.ts` - Hook للدردشة
- ✅ `hooks/useAIRecommendations.ts` - Hook للتوصيات
- ✅ `hooks/useAIAvailability.ts` - Hook للتحقق من التوفر

### 4. تحديث ChatWidget
- ✅ دمج AI Service الحقيقي
- ✅ معالجة حالات التحميل
- ✅ معالجة الأخطاء
- ✅ عرض الردود من OpenAI

### 5. إضافة Configuration
- ✅ `config.ts` - إعدادات مركزية
- ✅ التحقق من صحة الإعدادات
- ✅ عرض حالة AI في وضع التطوير

## 🚀 كيفية الاستخدام

### الاستخدام الأساسي

```tsx
import { ChatWidget, ChatButton } from '@/features/ai';

function MenuPage() {
  const { restaurantId } = useParams();
  
  return (
    <div>
      {/* محتوى الصفحة */}
      
      {/* إضافة Chat Widget */}
      <ChatButton />
      {restaurantId && <ChatWidget restaurantId={restaurantId} />}
    </div>
  );
}
```

### استخدام AI Service مباشرة

```tsx
import { aiService } from '@/features/ai';

// إرسال رسالة
const response = await aiService.chat({
  message: 'ما هي الأطباق المتوفرة؟',
  restaurantId: 'restaurant-123',
  sessionId: 'session-456',
});

console.log(response.message); // رد المساعد الذكي
console.log(response.suggestions); // اقتراحات الأطباق
```

### استخدام React Query Hook

```tsx
import { useAIChat } from '@/features/ai';

function MyComponent() {
  const { mutate: sendMessage, isPending } = useAIChat({
    onSuccess: (response) => {
      console.log('AI Response:', response.message);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });
  
  const handleSend = () => {
    sendMessage({
      message: 'أريد طبقاً حاراً',
      restaurantId: 'restaurant-123',
    });
  };
  
  return (
    <button onClick={handleSend} disabled={isPending}>
      {isPending ? 'جاري الإرسال...' : 'إرسال'}
    </button>
  );
}
```

## ⚙️ الإعدادات

### متغيرات البيئة

```env
# مفتاح OpenAI API
VITE_OPENAI_API_KEY=sk-proj-...

# نموذج AI المستخدم
VITE_AI_MODEL=gpt-4

# الحد الأقصى للرموز (Tokens)
VITE_AI_MAX_TOKENS=500

# درجة الحرارة (0.0 - 2.0)
VITE_AI_TEMPERATURE=0.7

# تفعيل ميزة AI
VITE_FEATURE_AI_ASSISTANT=true
```

### تخصيص System Prompt

يمكنك تخصيص رسالة النظام في `services/aiService.ts`:

```typescript
function buildSystemPrompt(restaurantId: string): string {
  return `أنت مساعد ذكي لمطعم SmartDine...`;
}
```

## 🔍 التحقق من الإعدادات

### في وضع التطوير

عند تشغيل المشروع، ستظهر رسالة في Console:

```
🤖 AI Configuration: {
  isEnabled: true,
  isConfigured: true,
  model: 'gpt-4',
  maxTokens: 500,
  temperature: 0.7
}
```

### برمجياً

```typescript
import { aiConfig } from '@/features/ai/config';

// التحقق من التوفر
console.log(aiConfig.isConfigured()); // true

// الحصول على الحالة
console.log(aiConfig.getStatus());

// التحقق من الصحة
const validation = aiConfig.validate();
if (!validation.valid) {
  console.error('Errors:', validation.errors);
}
```

## 📊 مثال على الاستخدام الكامل

```tsx
import React, { useState } from 'react';
import { useAIChat } from '@/features/ai';

function AIDemo() {
  const [messages, setMessages] = useState([]);
  
  const { mutate: sendMessage, isPending } = useAIChat({
    onSuccess: (response) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message,
        suggestions: response.suggestions,
      }]);
    },
  });
  
  const handleSend = (text: string) => {
    setMessages(prev => [...prev, {
      role: 'user',
      content: text,
    }]);
    
    sendMessage({
      message: text,
      restaurantId: 'restaurant-123',
    });
  };
  
  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>
          <strong>{msg.role}:</strong> {msg.content}
          {msg.suggestions?.map(dish => (
            <div key={dish.dishId}>
              {dish.name} - {dish.price} ر.س
            </div>
          ))}
        </div>
      ))}
      
      <button onClick={() => handleSend('أريد توصية')}>
        إرسال
      </button>
    </div>
  );
}
```

## 🔒 الأمان

### حماية المفتاح

- ✅ المفتاح مخزن في `.env.development` (غير مرفوع على Git)
- ✅ `.env.example` يحتوي على placeholder فقط
- ✅ المفتاح لا يظهر في الكود المصدري

### أفضل الممارسات

1. **لا تشارك المفتاح**: لا ترفع `.env.development` على Git
2. **استخدم متغيرات البيئة**: دائماً استخدم `import.meta.env`
3. **راقب الاستخدام**: تابع استهلاك API على OpenAI Dashboard
4. **حدد الصلاحيات**: استخدم مفاتيح API محدودة الصلاحيات

## 📈 مراقبة الاستخدام

### OpenAI Dashboard

راقب استخدامك على: https://platform.openai.com/usage

### في التطبيق

```typescript
// سيتم إضافة tracking للاستخدام لاحقاً
const usage = {
  totalRequests: 0,
  totalTokens: 0,
  cost: 0,
};
```

## 🐛 استكشاف الأخطاء

### المفتاح لا يعمل

```typescript
// تحقق من المفتاح
console.log(import.meta.env.VITE_OPENAI_API_KEY);

// تحقق من التكوين
import { aiConfig } from '@/features/ai/config';
console.log(aiConfig.validate());
```

### خطأ في الاتصال

```typescript
// تحقق من الشبكة
try {
  const response = await aiService.chat({...});
} catch (error) {
  console.error('AI Error:', error);
}
```

### الردود بطيئة

- استخدم `gpt-3.5-turbo` بدلاً من `gpt-4` للسرعة
- قلل `VITE_AI_MAX_TOKENS` لردود أقصر
- أضف timeout للطلبات

## 🎯 الخطوات التالية

### ميزات مقترحة

1. **تحسين استخراج الاقتراحات**
   - استخدام Function Calling من OpenAI
   - تحليل أفضل للردود

2. **إضافة Context**
   - تخزين تاريخ المحادثة
   - إرسال سياق القائمة للـ AI

3. **تحسين الأداء**
   - Cache للردود المتكررة
   - Streaming للردود الطويلة

4. **Analytics**
   - تتبع استخدام AI
   - قياس رضا المستخدمين

## 📚 موارد إضافية

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GPT-4 Guide](https://platform.openai.com/docs/guides/gpt)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)

## ✅ الخلاصة

تم إعداد خدمة الذكاء الاصطناعي بالكامل وهي جاهزة للاستخدام! 

- ✅ مفتاح OpenAI مضاف ويعمل
- ✅ AI Service جاهز
- ✅ React Query Hooks جاهزة
- ✅ ChatWidget متكامل مع AI
- ✅ معالجة الأخطاء موجودة
- ✅ التوثيق كامل

يمكنك الآن استخدام المساعد الذكي في أي صفحة من صفحات المشروع!
