import { z } from 'zod';

// Auth Validation Schemas
export const RegisterSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').max(50),
  username: z
    .string()
    .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
    .max(30)
    .regex(/^[a-zA-Z0-9_.]+$/, 'Kullanıcı adı yalnızca harf, rakam, alt çizgi ve nokta içerebilir'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(100),
  phone: z.string().optional(),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  emailOrUsername: z.string().min(3, 'E-posta veya kullanıcı adı giriniz'),
  password: z.string().min(1, 'Şifre gereklidir'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

// Profile Update Schema
export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_.]+$/)
    .optional(),
  bio: z.string().max(500, 'Biyografi en fazla 500 karakter olabilir').optional(),
  avatarUrl: z.string().optional().or(z.literal('')),
  lookingFor: z.string().optional(),
  languages: z.string().optional(),
  zodiac: z.string().optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
  communicationStyle: z.string().optional(),
  loveLanguage: z.string().optional(),
  pets: z.string().optional(),
  drinking: z.string().optional(),
  smoking: z.string().optional(),
  workout: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

// Event Creation Schema
export const CreateEventSchema = z.object({
  title: z.string().min(3, 'Etkinlik başlığı en az 3 karakter olmalıdır').max(100),
  category: z.enum([
    'Müzik & Konser',
    'Kahve & Yemek',
    'Doğa & Spor',
    'Sinema & Kültür',
    'Teknoloji & Hobi',
    'Gece Hayatı & Parti',
    'Gönüllülük & Topluluk',
    'Diğer',
  ]),
  date: z.string().min(1, 'Tarih ve saat seçiniz'),
  location: z.string().min(3, 'Mekan/konum giriniz').max(120),
  maxCapacity: z.number().int().min(2, 'Kontenjan en az 2 olmalıdır').max(500),
  price: z.enum(['Ücretsiz', 'Herkes Kendi Öder', 'Etkinlik Sahibi İkram Eder']),
  description: z.string().min(1, 'Açıklama gereklidir').max(2000),
  imageUrl: z.string().min(1, 'Kapak görseli gereklidir'),
  ageRange: z.string().optional(),
});
export type CreateEventInput = z.infer<typeof CreateEventSchema>;

// Reel Creation Schema
export const CreateReelSchema = z.object({
  caption: z.string().min(1, 'Açıklama giriniz').max(500),
  mediaUrl: z.string().min(1, 'Medya yüklenmelidir'),
  mediaType: z.enum(['IMAGE', 'VIDEO']).default('IMAGE'),
});
export type CreateReelInput = z.infer<typeof CreateReelSchema>;

// Comment Creation Schema
export const CreateCommentSchema = z.object({
  text: z.string().min(1, 'Yorum boş olamaz').max(500),
});
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

// Message Send Schema
export const SendMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  recipientId: z.string().uuid(),
  text: z.string().min(1, 'Mesaj boş olamaz').max(1000),
});
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
