
# 10-AI-Development-Rules.md
ai_rules = r"""# Loopin
## AI Development Rules
### Version 1.0

---

# 1. Genel Bakis

Bu dokuman, yapay zeka asistanlarinin (Claude, GPT, Gemini vb.) Loopin projesinde tutarli ve kaliteli kod uretmesi icin kurallari tanimlar. Tum AI prompt'lari ve kod uretim surecleri bu kurallara gore yurutulur.

---

# 2. AI Prompt Yapisi

## 2.1 Prompt Sablonu

Her AI prompt asagidaki yapida olmalidir:

```
# CONTEXT
- Proje: Loopin
- Modul: [Modul Adi]
- Dosya: [Dosya Yolu]
- Teknoloji: [Flutter/NestJS/NextJS]

# REQUIREMENTS
- [Gereksinim 1]
- [Gereksinim 2]

# CONSTRAINTS
- [Kisitlama 1]
- [Kisitlama 2]

# REFERENCE
- PRD: [Ilgili PRD bolumu]
- API Doc: [Ilgili endpoint]
- Screen Spec: [Ilgili ekran]

# OUTPUT FORMAT
- [Beklenen cikti formati]
```

## 2.2 Context Saglama Kurallari

### PRD Referansi
```
PRD Referans: "Loopin, etkinlik tabanli sosyal eslestirme platformudur. 
Temel prensip: 'Once etkinlik, sonra tanisma.'"
```

### Mevcut Kod Referansi
```
Mevcut Kod:
```dart
// Mevcut widget yapisi
class EventCard extends StatelessWidget {
  final Event event;
  const EventCard({super.key, required this.event});
  
  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(event.title),
        subtitle: Text(event.description),
      ),
    );
  }
}
```

Gereksinim: Bu widget'a katilimci sayisi ve tarih bilgisi ekleyin.
```

### Teknoloji Stack Referansi
```
Teknoloji Stack:
- Mobile: Flutter 3.x + Dart
- Backend: NestJS 10 + TypeScript
- Web: Next.js 14 + TypeScript
- Database: PostgreSQL 16 + TypeORM
- State Management: BLoC (Flutter)
```

---

# 3. Kod Uretim Kurallari

## 3.1 Flutter Kod Uretim Kurallari

### Widget Yapisi
```dart
// AI ASLA asagidaki yapida kod uretmemeli:
// - StatefulWidget gereksiz kullanimi
// - Build ici setState
// - Hardcoded degerler
// - Magic numbers

// AI HER ZAMAN su yapida kod uretmeli:
// - StatelessWidget tercihi
// - const constructor kullanimi
// - Theme'dan renk/boyut alma
// - Reusable widget'lara bolme

// ✅ Dogru Ornek
class EventCard extends StatelessWidget {
  final Event event;
  final VoidCallback? onTap;
  
  const EventCard({
    super.key,
    required this.event,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        margin: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.sm,
        ),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(context),
              const SizedBox(height: AppSpacing.md),
              _buildDetails(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      children: [
        CategoryIcon(category: event.category),
        const SizedBox(width: AppSpacing.sm),
        Expanded(
          child: Text(
            event.title,
            style: Theme.of(context).textTheme.titleMedium,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  Widget _buildDetails(BuildContext context) {
    return Row(
      children: [
        Icon(Icons.calendar_today, 
          size: 16, 
          color: Theme.of(context).colorScheme.onSurfaceVariant,
        ),
        const SizedBox(width: AppSpacing.xs),
        Text(
          event.formattedDate,
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const Spacer(),
        ParticipantBadge(
          current: event.approvedCount,
          max: event.maxParticipants,
        ),
      ],
    );
  }
}
```

### BLoC Kod Uretimi
```dart
// AI BLoC uretirken:
// 1. Event'ler immutable olmali
// 2. State'ler Equatable ile karsilastirilabilir olmali
// 3. Her BLoC'ta loading, success, error state'leri olmali
// 4. Side-effect'ler event emitter ile yonetilmeli

// ✅ Dogru Ornek
// events/events_event.dart
@immutable
abstract class EventsEvent {
  const EventsEvent();
}

class LoadEvents extends EventsEvent {
  final EventFilter? filter;
  const LoadEvents({this.filter});
}

class LoadMoreEvents extends EventsEvent {
  const LoadMoreEvents();
}

class RefreshEvents extends EventsEvent {
  const RefreshEvents();
}

// events/events_state.dart
@immutable
abstract class EventsState extends Equatable {
  const EventsState();
  
  @override
  List<Object?> get props => [];
}

class EventsInitial extends EventsState {
  const EventsInitial();
}

class EventsLoading extends EventsState {
  const EventsLoading();
}

class EventsLoaded extends EventsState {
  final List<Event> events;
  final bool hasMore;
  final bool isLoadingMore;
  final EventFilter? currentFilter;
  
  const EventsLoaded({
    required this.events,
    this.hasMore = true,
    this.isLoadingMore = false,
    this.currentFilter,
  });
  
  EventsLoaded copyWith({
    List<Event>? events,
    bool? hasMore,
    bool? isLoadingMore,
    EventFilter? currentFilter,
  }) {
    return EventsLoaded(
      events: events ?? this.events,
      hasMore: hasMore ?? this.hasMore,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      currentFilter: currentFilter ?? this.currentFilter,
    );
  }
  
  @override
  List<Object?> get props => [events, hasMore, isLoadingMore, currentFilter];
}

class EventsError extends EventsState {
  final String message;
  final bool isRetryable;
  
  const EventsError({
    required this.message,
    this.isRetryable = true,
  });
  
  @override
  List<Object?> get props => [message, isRetryable];
}

// events/events_bloc.dart
class EventsBloc extends Bloc<EventsEvent, EventsState> {
  final GetEventsUseCase _getEventsUseCase;
  int _currentPage = 1;
  static const int _pageSize = 20;

  EventsBloc({
    required GetEventsUseCase getEventsUseCase,
  })  : _getEventsUseCase = getEventsUseCase,
        super(const EventsInitial()) {
    on<LoadEvents>(_onLoadEvents);
    on<LoadMoreEvents>(_onLoadMoreEvents);
    on<RefreshEvents>(_onRefreshEvents);
  }

  Future<void> _onLoadEvents(
    LoadEvents event,
    Emitter<EventsState> emit,
  ) async {
    emit(const EventsLoading());
    _currentPage = 1;

    final result = await _getEventsUseCase(
      GetEventsParams(
        page: _currentPage,
        limit: _pageSize,
        filter: event.filter,
      ),
    );

    result.fold(
      (failure) => emit(EventsError(message: failure.message)),
      (paginatedEvents) => emit(EventsLoaded(
        events: paginatedEvents.items,
        hasMore: paginatedEvents.hasMore,
        currentFilter: event.filter,
      )),
    );
  }

  Future<void> _onLoadMoreEvents(
    LoadMoreEvents event,
    Emitter<EventsState> emit,
  ) async {
    final currentState = state;
    if (currentState is! EventsLoaded || 
        !currentState.hasMore || 
        currentState.isLoadingMore) {
      return;
    }

    emit(currentState.copyWith(isLoadingMore: true));
    _currentPage++;

    final result = await _getEventsUseCase(
      GetEventsParams(
        page: _currentPage,
        limit: _pageSize,
        filter: currentState.currentFilter,
      ),
    );

    result.fold(
      (failure) => emit(EventsError(message: failure.message)),
      (paginatedEvents) => emit(currentState.copyWith(
        events: [...currentState.events, ...paginatedEvents.items],
        hasMore: paginatedEvents.hasMore,
        isLoadingMore: false,
      )),
    );
  }

  Future<void> _onRefreshEvents(
    RefreshEvents event,
    Emitter<EventsState> emit,
  ) async {
    final currentState = state;
    if (currentState is! EventsLoaded) return;

    _currentPage = 1;
    final result = await _getEventsUseCase(
      GetEventsParams(
        page: _currentPage,
        limit: _pageSize,
        filter: currentState.currentFilter,
      ),
    );

    result.fold(
      (failure) => emit(EventsError(message: failure.message)),
      (paginatedEvents) => emit(EventsLoaded(
        events: paginatedEvents.items,
        hasMore: paginatedEvents.hasMore,
        currentFilter: currentState.currentFilter,
      )),
    );
  }
}
```

## 3.2 NestJS Kod Uretim Kurallari

### Controller Yapisi
```typescript
// AI Controller uretirken:
// 1. Her endpoint Swagger decorator ile dokumante edilmeli
// 2. Validasyon pipe'lari explicit olarak belirtilmeli
// 3. Auth guard'lar her endpoint'te belirtilmeli
// 4. Response DTO'lari tanimlanmali

// ✅ Dogru Ornek
@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List events with filters' })
  @ApiResponse({ 
    status: 200, 
    description: 'Events list',
    type: PaginatedEventsResponseDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  async findAll(
    @Query() query: FindEventsQueryDto,
    @CurrentUser() user: UserEntity,
  ): Promise<PaginatedEventsResponseDto> {
    return this.eventsService.findAll(query, user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, type: EventDetailResponseDto })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<EventDetailResponseDto> {
    return this.eventsService.findOne(id, user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new event' })
  @ApiResponse({ status: 201, type: EventResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Premium required for more events' })
  async create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: UserEntity,
  ): Promise<EventResponseDto> {
    return this.eventsService.create(createEventDto, user.id);
  }
}
```

### Service Yapisi
```typescript
// AI Service uretirken:
// 1. Transaction kullanimi zorunlu
// 2. Cache invalidation unutulmamali
// 3. Event emitter ile side-effect'ler
// 4. Repository pattern kullanimi

// ✅ Dogru Ornek
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    dto: CreateEventDto,
    userId: string,
  ): Promise<EventResponseDto> {
    // Kullanici limit kontrolu
    const userEventCount = await this.eventRepository.count({
      where: { 
        creatorId: userId, 
        status: EventStatus.ACTIVE,
        date: MoreThanOrEqual(new Date()),
      },
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const maxEvents = user.isPremium ? Infinity : 3;
    
    if (userEventCount >= maxEvents) {
      throw new ForbiddenException(
        'Free users can only create 3 active events. Upgrade to Premium.'
      );
    }

    // Transaction ile event olusturma
    const event = await this.eventRepository.manager.transaction(
      async (manager) => {
        const eventRepo = manager.getRepository(EventEntity);
        const appRepo = manager.getRepository(ApplicationEntity);

        const newEvent = await eventRepo.save({
          ...dto,
          creatorId: userId,
          status: EventStatus.ACTIVE,
        });

        // Olusturucuyu otomatik katilimci olarak ekle
        await appRepo.save({
          eventId: newEvent.id,
          applicantId: userId,
          status: ApplicationStatus.APPROVED,
        });

        return newEvent;
      },
    );

    // Cache invalidation
    await this.cacheService.delPattern(`events:city:${dto.city}*`);
    await this.cacheService.delPattern(`events:user:${userId}*`);

    // Event emit
    this.eventEmitter.emit('event.created', { eventId: event.id, userId });

    return this.mapToResponseDto(event);
  }

  private mapToResponseDto(event: EventEntity): EventResponseDto {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      maxParticipants: event.maxParticipants,
      status: event.status,
      createdAt: event.createdAt,
    };
  }
}
```

## 3.3 API DTO Uretim Kurallari

```typescript
// AI DTO uretirken:
// 1. class-validator decorator'lari zorunlu
// 2. class-transformer ile transformasyon
// 3. ApiProperty Swagger decorator'lari
// 4. PartialType ile update DTO'lari

// ✅ Dogru Ornek
export class CreateEventDto {
  @ApiProperty({ 
    description: 'Event title',
    example: 'Akşam Yemeği @ Kadıköy',
    minLength: 5,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @ApiProperty({ 
    description: 'Event description',
    example: 'Kadıköy\'de güzel bir akşam yemeği...',
    minLength: 20,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(500)
  description: string;

  @ApiProperty({ description: 'Category ID', example: 1 })
  @IsInt()
  @IsPositive()
  categoryId: number;

  @ApiProperty({ description: 'Event date', example: '2026-07-20' })
  @IsDateString()
  @IsFutureDate() // Custom validator
  date: string;

  @ApiProperty({ description: 'Event time', example: '20:00:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
  time: string;

  @ApiProperty({ description: 'Location address', example: 'Kadıköy, Moda Caddesi' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  location: string;

  @ApiPropertyOptional({ description: 'Latitude', example: 40.9822 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude', example: 29.0244 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ description: 'Max participants', example: 4, minimum: 2 })
  @IsInt()
  @Min(2)
  @Max(50)
  maxParticipants: number;

  @ApiPropertyOptional({ description: 'Min age', example: 22 })
  @IsOptional()
  @IsInt()
  @Min(18)
  minAge?: number;

  @ApiPropertyOptional({ description: 'Max age', example: 35 })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  maxAge?: number;

  @ApiPropertyOptional({ 
    description: 'Gender preference',
    enum: GenderPreference,
    default: GenderPreference.ANY,
  })
  @IsOptional()
  @IsEnum(GenderPreference)
  genderPreference?: GenderPreference;

  @ApiPropertyOptional({ 
    description: 'Event goal',
    enum: EventGoal,
  })
  @IsOptional()
  @IsEnum(EventGoal)
  goal?: EventGoal;

  @ApiPropertyOptional({ 
    description: 'Payment type',
    enum: PaymentType,
    default: PaymentType.SPLIT,
  })
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
```

---

# 4. Dokuman Referans Kurallari

## 4.1 PRD Referansi
AI kod uretirken PRD'deki asagidaki bilgileri kullanmalidir:

| PRD Bolumu | Kullanim Amaci |
|------------|----------------|
| Problem Tanimi | Cozumun amacini anlama |
| Modul Tanimlari | Hangi modulde calisildigini belirleme |
| Ekran Listesi | UI gereksinimlerini anlama |
| Kullanici Rolleri | Yetkilendirme mantigi |
| MVP Kapsami | Onceliklendirme |

## 4.2 Database Design Referansi
```
AI kod uretirken:
1. Entity isimlerini database design'dan al
2. Iliski tanimlarini (OneToMany, ManyToOne) dogru kullan
3. Index'leri goz onunde bulundur
4. Constraint'leri (NOT NULL, UNIQUE) koru
```

## 4.3 API Documentation Referansi
```
AI kod uretirken:
1. Endpoint path'leri API doc'tan al
2. Request/response formatlarini koru
3. HTTP status kodlarini dogru kullan
4. Pagination parametrelerini uygula
```

## 4.4 Screen Specification Referansi
```
AI kod uretirken:
1. Widget yapilarini screen spec'ten al
2. Form validasyon kurallarini uygula
3. State yonetimini BLoC pattern'e gore yap
4. Responsive davranislari goz onunde bulundur
```

---

# 5. AI Kod Kalite Kontrolu

## 5.1 Kontrol Listesi

AI her kod uretiminden once asagidaki kontrol listesini gozden gecirmelidir:

### Flutter Kontrol Listesi
- [ ] const constructor kullanildi mi?
- [ ] Theme'dan renk/boyut alindi mi?
- [ ] Magic number yerine sabit kullanildi mi?
- [ ] Widget'lar reusable parcalara bolundu mu?
- [ ] BLoC event/state immutable mi?
- [ ] Error handling var mi?
- [ ] Loading state yonetiliyor mu?
- [ ] Null safety kontrolu yapildi mi?

### NestJS Kontrol Listesi
- [ ] Transaction kullanildi mi?
- [ ] Cache invalidation unutulmadi mi?
- [ ] Swagger decorator'lari eklendi mi?
- [ ] Validation pipe'lari belirtildi mi?
- [ ] Auth guard'lar eklendi mi?
- [ ] Error handling (try-catch) var mi?
- [ ] Repository injection dogru yapildi mi?
- [ ] N+1 query sorunu var mi?

### Genel Kontrol Listesi
- [ ] Kod PRD ile tutarli mi?
- [ ] Database design'a uygun mu?
- [ ] API documentation'a uygun mu?
- [ ] Screen specification'a uygun mu?
- [ ] Security best practices uygulandi mi?
- [ ] Performance dusunuldu mu?
- [ ] Test edilebilir mi?

## 5.2 Kod Inceleme Promptu
```
Asagidaki kodu incele ve kontrol listesine gore degerlendir:

KOD:
[Uretilen kod]

KONTROL LISTESI:
- [Flutter/NestJS] kontrol listesi

GEREKSINIMLER:
- [Ilkili PRD/API/Screen bilgileri]

CIKTI FORMATI:
1. Bulunan hatalar
2. Onerilen duzeltmeler
3. Genel degerlendirme (1-10)
```

---

# 6. AI Context Yonetimi

## 6.1 Context Boyutu Sinirlari
```
- Maksimum context: 8000 token
- PRD referansi: Ozet halinde (max 500 token)
- Mevcut kod: Sadece ilgili kisimlar
- Dokuman referanslari: Link/sayfa numarasi ile
```

## 6.2 Context Optimizasyonu
```
AI prompt'lari optimize etmek icin:
1. Sadece gerekli dokumanlari referans al
2. Kod orneklerini kisa tut
3. Tekrarlayan bilgileri cikar
4. Bullet point'leri tercih et
```

---

# 7. AI ile Iteratif Gelistirme

## 7.1 Iterasyon Adimlari
```
1. ANALIZ: Gereksinimleri anla
2. PLAN: Uygulama plani olustur
3. KOD: Ilk versiyonu uret
4. KONTROL: Kalite kontrolu yap
5. DUZELT: Hatalari gider
6. TEST: Test senaryolarini kontrol et
```

## 7.2 Geri Bildirim Dongusu
```
Kullanici geri bildirimi alindiginda:
1. Geri bildirimi kategorize et (hata, iyilestirme, yeni ozellik)
2. Ilgili dokumani guncelle
3. Kodu duzelt
4. Kontrol listesini tekrar calistir
5. Degisiklikleri ozetle
```

---

# 8. AI Prompt Ornekleri

## 8.1 Flutter Widget Uretimi
```
CONTEXT:
- Proje: Loopin
- Modul: Events
- Dosya: presentation/widgets/cards/event_card.dart
- Teknoloji: Flutter 3.x

REQUIREMENTS:
- Etkinlik karti widget'i uret
- EventCard isminde StatelessWidget olmali
- Asagidaki bilgileri gostermeli:
  * Kategori ikonu ve rengi
  * Etkinlik basligi
  * Tarih ve saat
  * Konum
  * Katilimci sayisi (current/max)
  * Olusturan kullanici adi ve rating
- OnTap callback'i almali
- const constructor kullanilmali
- AppTheme dark tema kullanilmali

CONSTRAINTS:
- Max 200 satir
- Reusable widget'lara bolunmeli
- Skeleton loading destegi olmali

REFERENCE:
- Screen Spec: SCR-011 (Home Feed), SCR-013 (Event Detail)
- API Doc: GET /api/v1/events response formati

OUTPUT FORMAT:
- Tam Flutter widget kodu
- Gerekli import'lar dahil
- Kisa aciklama yorumlari
```

## 8.2 NestJS Endpoint Uretimi
```
CONTEXT:
- Proje: Loopin
- Modul: Events
- Dosya: src/modules/events/events.controller.ts
- Teknoloji: NestJS 10 + TypeScript

REQUIREMENTS:
- Etkinliklerin listelenmesi endpoint'i
- JWT auth gerektirmeli
- Query parametreleri ile filtreleme:
  * page, limit (pagination)
  * city, category (filtreleme)
  * lat, lng, radius (konum)
  * dateFrom, dateTo (tarih)
- Response: PaginatedEventsResponseDto
- Swagger dokumantasyonu olmali
- Rate limiting uygulanmali

CONSTRAINTS:
- Repository pattern kullanilmali
- Cache mekanizmasi dusunulmeli
- N+1 query sorunu olmamali

REFERENCE:
- API Doc: 4.1 List Events
- Database Design: events tablosu, indeksler
- Backend Rules: Controller ve Service kurallari

OUTPUT FORMAT:
- Controller kodu
- Gerekli DTO'lar
- Service interface'i
```

## 8.3 Database Migration Uretimi
```
CONTEXT:
- Proje: Loopin
- Modul: Events
- Teknoloji: TypeORM + PostgreSQL

REQUIREMENTS:
- events tablosu migration'i
- Asagidaki kolonlar olmali:
  * id (UUID, PK)
  * creator_id (UUID, FK)
  * title (varchar 200)
  * description (text)
  * category_id (int, FK)
  * date (date)
  * time (time)
  * location (varchar 300)
  * latitude, longitude (decimal)
  * max_participants (int)
  * status (enum)
  * created_at, updated_at (timestamp)
- Index'ler:
  * creator_id
  * category_id
  * date
  * status
  * location (GIST spatial index)
- Foreign key constraint'ler

REFERENCE:
- Database Design: 3.8 events tablosu
- Backend Rules: Migration kurallari

OUTPUT FORMAT:
- TypeORM migration class'i
- Up ve down metodlari
- Yorumlar ile aciklamalar
```

---

# 9. AI Hata Ayiklama Kurallari

## 9.1 Hata Analizi Promptu
```
CONTEXT:
- Hata mesaji: [Hata mesaji]
- Dosya: [Hata olan dosya]
- Satir: [Hata satiri]

KOD:
[Ilkili kod parcasi]

ANALIZ:
1. Hatanin nedeni nedir?
2. Cozum onerileri nelerdir?
3. Benzer hatalari nasil onleriz?

CIKTI FORMATI:
- Hata analizi
- Cozum kodu
- Onleyici tedbirler
```

## 9.2 Debug Stratejileri
```
AI debug yaparken:
1. Hata mesajini analiz et
2. Stack trace'i incele
3. Ilgili kodu kontrol et
4. Dokumanlari referans al
5. Cozum uret
6. Test senaryosu oner
```

---

# 10. AI Dokuman Guncelleme Kurallari

## 10.1 Guncelleme Tetikleyicileri
```
Dokuman guncellemesi gerektiren durumlar:
1. Yeni modul eklenmesi
2. API degisikligi
3. Database schema degisikligi
4. Yeni ekran eklenmesi
5. Teknoloji degisikligi
6. Guvenlik acigi duzeltmesi
```

## 10.2 Guncelleme Sureci
```
1. Degisikligi tanimla
2. Etkilenen dokumanlari belirle
3. Dokumanlari guncelle
4. Versiyon numarasini artir
5. Degisiklik ozetini olustur
6. Takimla paylas
```

---

# SONUC

Bu AI gelistirme kurallari, Loopin projesinde yapay zeka asistanlarinin tutarli, kaliteli ve dokumanlara uygun kod uretmesini saglar. Her AI etkilesiminde bu kurallar referans alinmalidir.
"""

with open('/mnt/agents/output/10-AI-Development-Rules.md', 'w', encoding='utf-8') as f:
    f.write(ai_rules)

print("✅ 10-AI-Development-Rules.md olusturuldu")
