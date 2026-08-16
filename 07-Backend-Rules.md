
# 07-Backend-Rules.md
backend_rules = """# Loopin
## Backend Development Rules
### Version 1.0

---

# 1. Genel Kurallar

## 1.1 Proje Yapısı
```
backend/
├── src/
│   ├── main.ts                    # Uygulama giriş noktası
│   ├── app.module.ts              # Root modül
│   ├── config/
│   │   ├── database.config.ts     # DB yapılandırması
│   │   ├── redis.config.ts        # Redis yapılandırması
│   │   ├── firebase.config.ts     # FCM yapılandırması
│   │   └── app.config.ts          # Genel yapılandırma
│   ├── common/
│   │   ├── decorators/            # Custom decorators
│   │   ├── dto/                   # Shared DTO'lar
│   │   ├── enums/                 # Shared enum'lar
│   │   ├── exceptions/            # Custom exception'lar
│   │   ├── filters/               # Exception filters
│   │   ├── guards/                # Auth guards
│   │   ├── interceptors/          # Interceptors
│   │   ├── pipes/                 # Validation pipes
│   │   └── utils/                 # Yardımcı fonksiyonlar
│   ├── modules/
│   │   ├── auth/                  # Auth modülü
│   │   ├── users/                 # User modülü
│   │   ├── events/                # Event modülü
│   │   ├── applications/          # Application modülü
│   │   ├── messages/              # Message modülü
│   │   ├── notifications/         # Notification modülü
│   │   ├── ratings/               # Rating modülü
│   │   ├── payments/              # Payment modülü
│   │   ├── search/                # Search modülü
│   │   └── admin/                 # Admin modülü
│   └── database/
│       ├── migrations/              # TypeORM migration'ları
│       └── seeds/                   # Seed data
├── test/                          # E2E test'ler
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package.json
├── tsconfig.json
└── .env
```

## 1.2 Kodlama Standartları

### Naming Conventions
```typescript
// Dosya isimleri: kebab-case
// auth.controller.ts, user.service.ts

// Sınıf isimleri: PascalCase
class AuthController {}
class UserService {}

// Interface isimleri: PascalCase + I prefix (opsiyonel)
interface IUser {}
interface CreateUserDto {}

// Enum isimleri: PascalCase
enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

// Değişken ve fonksiyon isimleri: camelCase
const userCount = 0;
function getUserById() {}

// Sabitler: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// Özel tipler: PascalCase + Type suffix
type UserResponseType = { ... };
```

### Import Sırası
```typescript
// 1. Node.js built-in
import { join } from 'path';

// 2. External packages
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

// 3. Internal modules (absolute imports)
import { UserService } from '@modules/users/user.service';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';

// 4. Relative imports (same module)
import { UserEntity } from './entities/user.entity';
```

---

# 2. Modül Yapısı

## 2.1 Her Modül İçin Standart Yapı
```
modules/
└── users/
    ├── dto/
    │   ├── create-user.dto.ts
    │   ├── update-user.dto.ts
    │   └── user-response.dto.ts
    ├── entities/
    │   └── user.entity.ts
    ├── interfaces/
    │   └── user.interface.ts
    ├── repositories/
    │   └── user.repository.ts
    ├── users.controller.ts
    ├── users.service.ts
    ├── users.module.ts
    └── users.controller.spec.ts
```

## 2.2 Controller Kuralları
```typescript
// users.controller.ts
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/me - Kendi profilini getir
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async getMe(@CurrentUser() user: UserEntity): Promise<UserResponseDto> {
    return this.usersService.findById(user.id);
  }

  // GET /users/:id - Başka kullanıcı profili (public)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<PublicUserDto> {
    return this.usersService.findPublicById(id);
  }

  // PATCH /users/profile - Profil güncelle
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.usersService.updateProfile(user.id, dto);
  }
}
```

### Controller Kuralları
- Her endpoint için `@ApiOperation` ve `@ApiResponse` zorunlu
- `@UseGuards` ile yetkilendirme explicit olarak belirtilmeli
- Param validasyonu için `ParseUUIDPipe`, `ParseIntPipe` kullan
- Body validasyonu için `ValidationPipe` zorunlu
- DTO'lar controller'dan service'a geçirilmeli

## 2.3 Service Kuralları
```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // READ operasyonları
  async findById(id: string): Promise<UserResponseDto> {
    const cacheKey = `user:${id}`;
    const cached = await this.cacheService.get<UserResponseDto>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'interests'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = this.mapToResponseDto(user);
    await this.cacheService.set(cacheKey, result, 3600); // 1 saat
    
    return result;
  }

  // WRITE operasyonları
  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Transaction kullan
    await this.userRepository.manager.transaction(async (manager) => {
      await manager.save(UserProfileEntity, {
        ...user.profile,
        ...dto,
        userId,
      });
    });

    // Cache invalidate
    await this.cacheService.del(`user:${userId}`);
    
    // Event emit
    this.eventEmitter.emit('user.profile.updated', { userId });

    return this.findById(userId);
  }
}
```

### Service Kuralları
- Her service `@Injectable()` decorator ile işaretlenmeli
- Repository injection `@InjectRepository()` ile yapılmalı
- Cache kullanımı her READ operasyonunda düşünülmeli
- Transaction kullanımı her WRITE operasyonunda zorunlu
- Event emitter ile side-effect'ler yönetilmeli
- Hata fırlatma: `NotFoundException`, `BadRequestException`, `ConflictException`

## 2.4 DTO Kuralları
```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+90[0-9]{10}$/, { message: 'Invalid phone format' })
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase and digit',
  })
  password: string;
}

// update-profile.dto.ts
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsDateString()
  @Validate(IsAdultValidator)
  birthDate?: string;

  @IsOptional()
  @IsEnum(UserGoal)
  goal?: UserGoal;
}
```

### DTO Kuralları
- Her DTO `class-validator` decorator'ları ile validasyonlu
- `class-transformer` ile transformasyon
- `PartialType` ile update DTO'ları oluştur
- Custom validator'lar `validators/` klasöründe
- Response DTO'ları `response/` alt klasöründe

## 2.5 Entity Kuralları
```typescript
// user.entity.ts
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isPremium: boolean;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserProfileEntity, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile: UserProfileEntity;

  @OneToMany(() => EventEntity, (event) => event.creator)
  events: EventEntity[];
}
```

### Entity Kuralları
- Entity isimleri: `XxxEntity`
- Tablo isimleri: snake_case, çoğul
- UUID primary key: `@PrimaryGeneratedColumn('uuid')`
- Timestamp'lar: `@CreateDateColumn()`, `@UpdateDateColumn()`
- Soft delete: `@DeleteDateColumn()` (opsiyonel)
- İlişkiler: explicit `cascade`, `eager`, `lazy` belirtilmeli
- Index'ler: `@Index()` decorator ile tanımlanmalı

---

# 3. Validasyon Kuralları

## 3.1 Global Validation Pipe
```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // DTO'da olmayan alanları sil
    forbidNonWhitelisted: true,   // Bilinmeyen alanlarda hata fırlat
    transform: true,              // Auto-transform
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

## 3.2 Custom Validators
```typescript
// validators/is-adult.validator.ts
@ValidatorConstraint({ async: false })
export class IsAdultValidator implements ValidatorConstraintInterface {
  validate(birthDate: string): boolean {
    const age = differenceInYears(new Date(), new Date(birthDate));
    return age >= 18;
  }

  defaultMessage(): string {
    return 'User must be at least 18 years old';
  }
}
```

## 3.3 Custom Pipes
```typescript
// pipes/parse-uuid.pipe.ts
@Injectable()
export class ParseUUIDPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return value;
  }
}
```

---

# 4. Authentication & Authorization

## 4.1 JWT Strategy
```typescript
// auth/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.usersService.findById(payload.sub);
    
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
```

## 4.2 Guards
```typescript
// guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

## 4.3 Decorators
```typescript
// decorators/current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

// decorators/roles.decorator.ts
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

---

# 5. Error Handling

## 5.1 Global Exception Filter
```typescript
// filters/http-exception.filter.ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;
      message = response.message || exception.message;
      code = response.code || this.getErrorCode(status);
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }

  private getErrorCode(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMIT',
    };
    return codes[status] || 'UNKNOWN_ERROR';
  }
}
```

## 5.2 Custom Exceptions
```typescript
// exceptions/business.exception.ts
export class BusinessException extends HttpException {
  constructor(message: string, code: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super({ message, code, statusCode: status }, status);
  }
}

// exceptions/user-not-found.exception.ts
export class UserNotFoundException extends BusinessException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`, 'USER_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
```

---

# 6. Database Kuralları

## 6.1 Repository Pattern
```typescript
// repositories/user.repository.ts
@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    return this.findOne({ where: { phone } });
  }

  async findWithProfile(userId: string): Promise<UserEntity | null> {
    return this.findOne({
      where: { id: userId },
      relations: ['profile', 'interests'],
    });
  }

  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.count({ where: { phone } });
    return count > 0;
  }
}
```

## 6.2 Transaction Kullanımı
```typescript
// Service içinde transaction
async createEventWithParticipants(dto: CreateEventDto, userId: string): Promise<EventEntity> {
  return this.dataSource.transaction(async (manager) => {
    const eventRepo = manager.getRepository(EventEntity);
    const applicationRepo = manager.getRepository(ApplicationEntity);

    const event = await eventRepo.save({
      ...dto,
      creatorId: userId,
      status: EventStatus.ACTIVE,
    });

    // Otomatik olarak oluşturucuyu katılımcı olarak ekle
    await applicationRepo.save({
      eventId: event.id,
      applicantId: userId,
      status: ApplicationStatus.APPROVED,
    });

    return event;
  });
}
```

## 6.3 Migration Kuralları
```typescript
// migrations/001-create-users-table.ts
export class CreateUsersTable1699999999999 implements MigrationInterface {
  name = 'CreateUsersTable1699999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isUnique: true,
            isNullable: false,
          },
          // ... diğer kolonlar
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_phone',
        columnNames: ['phone'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

---

# 7. Cache Kuralları

## 7.1 Cache Service
```typescript
// common/services/cache.service.ts
@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.cacheManager.get<string>(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: unknown, ttl: number = 3600): Promise<void> {
    await this.cacheManager.set(key, JSON.stringify(value), ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async delPattern(pattern: string): Promise<void> {
    const keys = await this.cacheManager.store.keys(pattern);
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }
}
```

## 7.2 Cache Key Patterns
```typescript
const CACHE_KEYS = {
  user: (id: string) => `user:${id}`,
  userProfile: (id: string) => `user:${id}:profile`,
  events: (city: string) => `events:city:${city}`,
  eventDetail: (id: string) => `event:${id}`,
  conversations: (userId: string) => `conversations:${userId}`,
  unreadCount: (userId: string) => `unread:${userId}`,
} as const;
```

---

# 8. Logging Kuralları

## 8.1 Logger Service
```typescript
// common/services/logger.service.ts
@Injectable()
export class AppLoggerService extends Logger {
  log(message: string, context?: string, metadata?: Record<string, unknown>): void {
    super.log(message, context);
    // Structured logging to external service
  }

  error(message: string, trace?: string, context?: string): void {
    super.error(message, trace, context);
    // Send to error tracking service
  }

  logRequest(req: Request, res: Response, duration: number): void {
    this.log('HTTP Request', 'HTTP', {
      method: req.method,
      path: req.url,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id,
      ip: req.ip,
    });
  }
}
```

## 8.2 Interceptor ile Request Logging
```typescript
// interceptors/logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const duration = Date.now() - start;
        this.logger.logRequest(request, response, duration);
      }),
    );
  }
}
```

---

# 9. Testing Kuralları

## 9.1 Unit Test Pattern
```typescript
// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UserRepository>;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: createMock<UserRepository>(),
        },
        {
          provide: CacheService,
          useValue: createMock<CacheService>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UserRepository);
    cacheService = module.get(CacheService);
  });

  describe('findById', () => {
    it('should return user from cache if exists', async () => {
      const cachedUser = { id: '1', fullName: 'Test' };
      cacheService.get.mockResolvedValue(cachedUser);

      const result = await service.findById('1');

      expect(result).toEqual(cachedUser);
      expect(repository.findOne).not.toHaveBeenCalled();
    });

    it('should return user from DB and cache it', async () => {
      const dbUser = { id: '1', fullName: 'Test' } as UserEntity;
      cacheService.get.mockResolvedValue(null);
      repository.findOne.mockResolvedValue(dbUser);

      const result = await service.findById('1');

      expect(result).toBeDefined();
      expect(cacheService.set).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      cacheService.get.mockResolvedValue(null);
      repository.findOne.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });
});
```

## 9.2 E2E Test Pattern
```typescript
// test/auth.e2e-spec.ts
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          phone: '+905551234567',
          password: 'TestPass123!',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.userId).toBeDefined();
        });
    });

    it('should return 400 for invalid phone', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          phone: 'invalid',
          password: 'TestPass123!',
        })
        .expect(400);
    });
  });
});
```

---

# 10. Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/loopin
DATABASE_SSL=false

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Firebase
FIREBASE_PROJECT_ID=loopin-app
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=loopin-media-dev
AWS_S3_REGION=eu-central-1

# Payment
STRIPE_SECRET_KEY=...
IYZICO_API_KEY=...
IYZICO_SECRET_KEY=...

# SMS
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

---

# 11. CI/CD Kuralları

## 11.1 Pre-commit Hooks
```yaml
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run format:check
npm run test:unit
```

## 11.2 GitHub Actions
```yaml
# .github/workflows/backend.yml
name: Backend CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:e2e
      - run: npm run build
```

---

# 12. Security Kuralları

## 12.1 Input Sanitization
```typescript
// Tüm kullanıcı input'ları sanitize edilmeli
import * as DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}
```

## 12.2 SQL Injection Prevention
```typescript
// TypeORM parametreli sorgular kullan
// ❌ Kötü
const users = await repository.query(`SELECT * FROM users WHERE name = '${name}'`);

// ✅ İyi
const users = await repository.find({ where: { name } });
```

## 12.3 XSS Prevention
```typescript
// Response DTO'larında HTML escape
// ❌ Kötü
return { bio: user.profile.bio };

// ✅ İyi
return { bio: escapeHtml(user.profile.bio) };
```

## 12.4 Rate Limiting
```typescript
// AppModule'de global rate limit
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 100,
})
```

---

# 13. Performance Kuralları

## 13.1 N+1 Query Prevention
```typescript
// ❌ Kötü - N+1 problemi
const events = await eventRepository.find();
for (const event of events) {
  const creator = await userRepository.findOne({ where: { id: event.creatorId } });
  // ...
}

// ✅ İyi - Join kullan
const events = await eventRepository.find({
  relations: ['creator', 'creator.profile'],
});
```

## 13.2 Pagination
```typescript
// Her zaman pagination kullan
async findAll(dto: PaginationDto): Promise<PaginatedResult<EventEntity>> {
  const [items, total] = await this.repository.findAndCount({
    skip: (dto.page - 1) * dto.limit,
    take: dto.limit,
    order: { createdAt: 'DESC' },
  });

  return {
    items,
    pagination: {
      page: dto.page,
      limit: dto.limit,
      total,
      totalPages: Math.ceil(total / dto.limit),
      hasNext: dto.page * dto.limit < total,
      hasPrev: dto.page > 1,
    },
  };
}
```

## 13.3 Async/Await
```typescript
// ❌ Kötü - Sequential
const user = await getUser();
const events = await getEvents();
const notifications = await getNotifications();

// ✅ İyi - Parallel
const [user, events, notifications] = await Promise.all([
  getUser(),
  getEvents(),
  getNotifications(),
]);
```

---

# SONUÇ

Bu backend geliştirme kuralları, Loopin platformunun NestJS backend'i için kodlama standartları, mimari prensipler ve best practice'leri tanımlar.
"""

with open('/mnt/agents/output/07-Backend-Rules.md', 'w', encoding='utf-8') as f:
    f.write(backend_rules)

print("✅ 07-Backend-Rules.md oluşturuldu")
