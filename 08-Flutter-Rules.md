
# 08-Flutter-Rules.md
flutter_rules = """# Loopin
## Flutter Development Rules
### Version 1.0

---

# 1. Genel Kurallar

## 1.1 Proje Yapısı
```
lib/
├── main.dart                    # Uygulama giriş noktası
├── app.dart                     # MaterialApp / CupertinoApp
├── config/
│   ├── routes.dart              # Route tanımlamaları
│   ├── theme.dart               # Tema yapılandırması
│   ├── constants.dart           # Sabitler
│   └── env.dart                 # Environment değişkenleri
├── core/
│   ├── di/                      # Dependency Injection
│   │   └── injection.dart       # GetIt setup
│   ├── errors/                  # Hata sınıfları
│   │   ├── exceptions.dart
│   │   └── failures.dart
│   ├── network/                 # Network katmanı
│   │   ├── api_client.dart
│   │   ├── dio_interceptor.dart
│   │   └── network_info.dart
│   ├── usecases/                # Use case'ler
│   │   └── usecase.dart
│   └── utils/                   # Yardımcı fonksiyonlar
│       ├── extensions.dart
│       ├── helpers.dart
│       └── validators.dart
├── data/
│   ├── datasources/             # Data sources
│   │   ├── local/               # Local data sources
│   │   │   ├── database.dart
│   │   │   └── shared_prefs.dart
│   │   └── remote/              # Remote data sources
│   │       ├── auth_remote.dart
│   │       ├── user_remote.dart
│   │       └── event_remote.dart
│   ├── models/                  # Data models (JSON serialization)
│   │   ├── user_model.dart
│   │   ├── event_model.dart
│   │   └── ...
│   └── repositories/            # Repository implementations
│       ├── auth_repository_impl.dart
│       ├── user_repository_impl.dart
│       └── ...
├── domain/
│   ├── entities/                # Domain entities
│   │   ├── user.dart
│   │   ├── event.dart
│   │   └── ...
│   ├── repositories/            # Repository interfaces
│   │   ├── auth_repository.dart
│   │   ├── user_repository.dart
│   │   └── ...
│   └── usecases/                # Use case interfaces
│       ├── auth/
│       │   ├── login.dart
│       │   ├── register.dart
│       │   └── ...
│       ├── events/
│       │   ├── get_events.dart
│       │   ├── create_event.dart
│       │   └── ...
│       └── ...
├── presentation/
│   ├── blocs/                   # State management (BLoC)
│   │   ├── auth/
│   │   │   ├── auth_bloc.dart
│   │   │   ├── auth_event.dart
│   │   │   └── auth_state.dart
│   │   ├── events/
│   │   │   ├── events_bloc.dart
│   │   │   ├── events_event.dart
│   │   │   └── events_state.dart
│   │   └── ...
│   ├── pages/                   # Ekranlar
│   │   ├── splash/
│   │   │   └── splash_page.dart
│   │   ├── auth/
│   │   │   ├── login_page.dart
│   │   │   ├── register_page.dart
│   │   │   └── verification_page.dart
│   │   ├── home/
│   │   │   └── home_page.dart
│   │   ├── events/
│   │   │   ├── event_detail_page.dart
│   │   │   ├── create_event_page.dart
│   │   │   └── ...
│   │   ├── messages/
│   │   │   ├── messages_page.dart
│   │   │   └── chat_page.dart
│   │   └── profile/
│   │       ├── profile_page.dart
│   │       ├── edit_profile_page.dart
│   │       └── ...
│   └── widgets/                 # Reusable widgets
│       ├── buttons/
│       │   ├── primary_button.dart
│       │   ├── secondary_button.dart
│       │   └── icon_button.dart
│       ├── inputs/
│       │   ├── text_input.dart
│       │   ├── phone_input.dart
│       │   └── otp_input.dart
│       ├── cards/
│       │   ├── event_card.dart
│       │   ├── user_card.dart
│       │   └── message_card.dart
│       ├── overlays/
│       │   ├── bottom_sheet.dart
│       │   ├── dialog.dart
│       │   └── snackbar.dart
│       └── common/
│           ├── loading_indicator.dart
│           ├── empty_state.dart
│           ├── error_state.dart
│           └── skeleton_loader.dart
└── generated/                   # Auto-generated files
    └── assets.dart              # Asset references
```

## 1.2 Kodlama Standartları

### Naming Conventions
```dart
// Dosya isimleri: snake_case
// auth_bloc.dart, event_card.dart, primary_button.dart

// Sınıf isimleri: PascalCase
class AuthBloc {}
class EventCard extends StatelessWidget {}
class PrimaryButton extends StatelessWidget {}

// Değişken ve fonksiyon isimleri: camelCase
final userName = '';
void handleLogin() {}

// Sabitler: camelCase (Dart convention)
const maxRetryCount = 3;
const defaultPageSize = 20;

// Enum isimleri: PascalCase
enum AppTheme { light, dark }

// Enum değerleri: camelCase
enum UserStatus { active, suspended, deleted }
```

### Import Sırası
```dart
// 1. Dart SDK
import 'dart:async';
import 'dart:convert';

// 2. Flutter packages
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// 3. External packages
import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';

// 4. Project files (absolute imports)
import 'package:loopin/config/theme.dart';
import 'package:loopin/core/di/injection.dart';
import 'package:loopin/domain/entities/user.dart';

// 5. Relative imports (same directory)
import 'auth_bloc.dart';
import 'auth_event.dart';
```

---

# 2. State Management (BLoC Pattern)

## 2.1 BLoC Yapısı
```dart
// auth_bloc.dart
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase _loginUseCase;
  final RegisterUseCase _registerUseCase;
  final VerifyOtpUseCase _verifyOtpUseCase;

  AuthBloc({
    required LoginUseCase loginUseCase,
    required RegisterUseCase registerUseCase,
    required VerifyOtpUseCase verifyOtpUseCase,
  })  : _loginUseCase = loginUseCase,
        _registerUseCase = registerUseCase,
        _verifyOtpUseCase = verifyOtpUseCase,
        super(const AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<VerifyOtpRequested>(_onVerifyOtpRequested);
    on<LogoutRequested>(_onLogoutRequested);
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final result = await _loginUseCase(
      LoginParams(
        phoneOrEmail: event.phoneOrEmail,
        password: event.password,
        rememberMe: event.rememberMe,
      ),
    );

    result.fold(
      (failure) => emit(AuthError(message: failure.message)),
      (user) => emit(AuthAuthenticated(user: user)),
    );
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    // Clear tokens, navigate to login
    emit(const AuthUnauthenticated());
  }
}
```

## 2.2 Event Tanımları
```dart
// auth_event.dart
@immutable
abstract class AuthEvent {
  const AuthEvent();
}

class LoginRequested extends AuthEvent {
  final String phoneOrEmail;
  final String password;
  final bool rememberMe;

  const LoginRequested({
    required this.phoneOrEmail,
    required this.password,
    this.rememberMe = false,
  });
}

class RegisterRequested extends AuthEvent {
  final String phone;
  final String? email;
  final String password;

  const RegisterRequested({
    required this.phone,
    this.email,
    required this.password,
  });
}

class VerifyOtpRequested extends AuthEvent {
  final String phone;
  final String otp;

  const VerifyOtpRequested({
    required this.phone,
    required this.otp,
  });
}

class LogoutRequested extends AuthEvent {
  const LogoutRequested();
}
```

## 2.3 State Tanımları
```dart
// auth_state.dart
@immutable
abstract class AuthState {
  const AuthState();
}

class AuthInitial extends AuthState {
  const AuthInitial();
}

class AuthLoading extends AuthState {
  const AuthLoading();
}

class AuthAuthenticated extends AuthState {
  final User user;

  const AuthAuthenticated({required this.user});
}

class AuthUnauthenticated extends AuthState {
  const AuthUnauthenticated();
}

class AuthError extends AuthState {
  final String message;

  const AuthError({required this.message});
}
```

## 2.4 BLoC Provider Kullanımı
```dart
// app.dart
class LoopinApp extends StatelessWidget {
  const LoopinApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => sl<AuthBloc>()),
        BlocProvider(create: (_) => sl<EventsBloc>()),
        BlocProvider(create: (_) => sl<MessagesBloc>()),
        BlocProvider(create: (_) => sl<ProfileBloc>()),
      ],
      child: MaterialApp(
        title: 'Loopin',
        theme: AppTheme.darkTheme,
        initialRoute: Routes.splash,
        onGenerateRoute: Routes.onGenerateRoute,
      ),
    );
  }
}
```

---

# 3. Clean Architecture

## 3.1 Katmanlar
```
Presentation Layer (UI + BLoC)
    ↓
Domain Layer (Entities + Use Cases + Repository Interfaces)
    ↓
Data Layer (Models + Repositories + Data Sources)
```

## 3.2 Entity
```dart
// domain/entities/user.dart
class User extends Equatable {
  final String id;
  final String phone;
  final String? email;
  final UserRole role;
  final bool isVerified;
  final bool isPremium;
  final UserProfile profile;

  const User({
    required this.id,
    required this.phone,
    this.email,
    required this.role,
    required this.isVerified,
    required this.isPremium,
    required this.profile,
  });

  @override
  List<Object?> get props => [id, phone, email, role, isVerified, isPremium, profile];
}
```

## 3.3 Use Case
```dart
// domain/usecases/auth/login.dart
class LoginUseCase implements UseCase<User, LoginParams> {
  final AuthRepository _repository;

  LoginUseCase(this._repository);

  @override
  Future<Either<Failure, User>> call(LoginParams params) async {
    return await _repository.login(
      phoneOrEmail: params.phoneOrEmail,
      password: params.password,
      rememberMe: params.rememberMe,
    );
  }
}

class LoginParams {
  final String phoneOrEmail;
  final String password;
  final bool rememberMe;

  LoginParams({
    required this.phoneOrEmail,
    required this.password,
    this.rememberMe = false,
  });
}
```

## 3.4 Repository Interface
```dart
// domain/repositories/auth_repository.dart
abstract class AuthRepository {
  Future<Either<Failure, User>> login({
    required String phoneOrEmail,
    required String password,
    required bool rememberMe,
  });

  Future<Either<Failure, void>> register({
    required String phone,
    String? email,
    required String password,
  });

  Future<Either<Failure, User>> verifyOtp({
    required String phone,
    required String otp,
  });

  Future<Either<Failure, void>> logout();

  Future<Either<Failure, User?>> checkAuthStatus();
}
```

## 3.5 Repository Implementation
```dart
// data/repositories/auth_repository_impl.dart
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final AuthLocalDataSource _localDataSource;
  final NetworkInfo _networkInfo;

  AuthRepositoryImpl({
    required AuthRemoteDataSource remoteDataSource,
    required AuthLocalDataSource localDataSource,
    required NetworkInfo networkInfo,
  })  : _remoteDataSource = remoteDataSource,
        _localDataSource = localDataSource,
        _networkInfo = networkInfo;

  @override
  Future<Either<Failure, User>> login({
    required String phoneOrEmail,
    required String password,
    required bool rememberMe,
  }) async {
    if (!await _networkInfo.isConnected) {
      return Left(NetworkFailure());
    }

    try {
      final result = await _remoteDataSource.login(
        phoneOrEmail: phoneOrEmail,
        password: password,
        rememberMe: rememberMe,
      );

      await _localDataSource.cacheUser(result);
      await _localDataSource.cacheToken(result.accessToken);

      return Right(result.toDomain());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } on UnauthorizedException {
      return Left(UnauthorizedFailure());
    }
  }
}
```

## 3.6 Model (Data Layer)
```dart
// data/models/user_model.dart
class UserModel extends User {
  const UserModel({
    required super.id,
    required super.phone,
    super.email,
    required super.role,
    required super.isVerified,
    required super.isPremium,
    required super.profile,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      phone: json['phone'] as String,
      email: json['email'] as String?,
      role: UserRole.values.firstWhere(
        (e) => e.name == json['role'],
        orElse: () => UserRole.user,
      ),
      isVerified: json['isVerified'] as bool,
      isPremium: json['isPremium'] as bool,
      profile: UserProfileModel.fromJson(json['profile'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'phone': phone,
      'email': email,
      'role': role.name,
      'isVerified': isVerified,
      'isPremium': isPremium,
      'profile': (profile as UserProfileModel).toJson(),
    };
  }

  User toDomain() => this;
}
```

---

# 4. UI Kuralları

## 4.1 Page Yapısı
```dart
// presentation/pages/auth/login_page.dart
class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const LoopinAppBar(title: 'Giriş Yap'),
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthError) {
            context.showErrorSnackbar(state.message);
          }
          if (state is AuthAuthenticated) {
            context.go(Routes.home);
          }
        },
        builder: (context, state) {
          return Stack(
            children: [
              const LoginForm(),
              if (state is AuthLoading)
                const FullScreenLoading(),
            ],
          );
        },
      ),
    );
  }
}
```

## 4.2 Form Widget
```dart
// presentation/pages/auth/widgets/login_form.dart
class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _rememberMe = false;
  bool _obscurePassword = true;

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _onSubmit() {
    if (_formKey.currentState?.validate() ?? false) {
      context.read<AuthBloc>().add(
        LoginRequested(
          phoneOrEmail: _phoneController.text.trim(),
          password: _passwordController.text,
          rememberMe: _rememberMe,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            PhoneInputField(
              controller: _phoneController,
              validator: Validators.phoneValidator,
            ),
            const SizedBox(height: AppSpacing.lg),
            PasswordInputField(
              controller: _passwordController,
              obscureText: _obscurePassword,
              onToggleVisibility: () {
                setState(() => _obscurePassword = !_obscurePassword);
              },
              validator: Validators.passwordValidator,
            ),
            const SizedBox(height: AppSpacing.md),
            CheckboxListTile(
              value: _rememberMe,
              onChanged: (value) => setState(() => _rememberMe = value ?? false),
              title: const Text('Beni hatırla'),
              controlAffinity: ListTileControlAffinity.leading,
              contentPadding: EdgeInsets.zero,
            ),
            const SizedBox(height: AppSpacing.xl),
            PrimaryButton(
              onPressed: _onSubmit,
              label: 'Giriş Yap',
            ),
          ],
        ),
      ),
    );
  }
}
```

## 4.3 Reusable Widget Kuralları
```dart
// presentation/widgets/buttons/primary_button.dart
class PrimaryButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final String label;
  final bool isLoading;
  final IconData? icon;
  final ButtonSize size;

  const PrimaryButton({
    super.key,
    required this.onPressed,
    required this.label,
    this.isLoading = false,
    this.icon,
    this.size = ButtonSize.medium,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: ElevatedButton.styleFrom(
        minimumSize: Size.fromHeight(size.height),
        padding: EdgeInsets.symmetric(horizontal: size.horizontalPadding),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
      ),
      child: isLoading
          ? const SizedBox(
              height: 20,
              width: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            )
          : Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (icon != null) ...[
                  Icon(icon, size: size.iconSize),
                  const SizedBox(width: AppSpacing.sm),
                ],
                Text(
                  label,
                  style: TextStyle(
                    fontSize: size.fontSize,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
    );
  }
}
```

---

# 5. Navigation

## 5.1 Route Tanımlamaları
```dart
// config/routes.dart
class Routes {
  static const String splash = '/';
  static const String welcome = '/welcome';
  static const String login = '/login';
  static const String register = '/register';
  static const String verifyPhone = '/verify-phone';
  static const String onboardingProfile = '/onboarding/profile';
  static const String onboardingLocation = '/onboarding/location';
  static const String onboardingPhotos = '/onboarding/photos';
  static const String onboardingInterests = '/onboarding/interests';
  static const String onboardingGoal = '/onboarding/goal';
  static const String home = '/home';
  static const String eventDetail = '/events/:id';
  static const String createEvent = '/events/create';
  static const String messages = '/messages';
  static const String chat = '/messages/:id';
  static const String profile = '/profile';
  static const String editProfile = '/profile/edit';
  static const String userProfile = '/users/:id';
  static const String notifications = '/notifications';
  static const String premium = '/premium';
  static const String settings = '/settings';
  static const String blockedUsers = '/settings/blocked';
  static const String report = '/report';

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashPage());
      case welcome:
        return MaterialPageRoute(builder: (_) => const WelcomePage());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginPage());
      case register:
        return MaterialPageRoute(builder: (_) => const RegisterPage());
      case home:
        return MaterialPageRoute(builder: (_) => const HomePage());
      case eventDetail:
        final args = settings.arguments as Map<String, dynamic>;
        return MaterialPageRoute(
          builder: (_) => EventDetailPage(eventId: args['id'] as String),
        );
      case messages:
        return MaterialPageRoute(builder: (_) => const MessagesPage());
      case chat:
        final args = settings.arguments as Map<String, dynamic>;
        return MaterialPageRoute(
          builder: (_) => ChatPage(conversationId: args['id'] as String),
        );
      case profile:
        return MaterialPageRoute(builder: (_) => const ProfilePage());
      case settings:
        return MaterialPageRoute(builder: (_) => const SettingsPage());
      default:
        return MaterialPageRoute(builder: (_) => const NotFoundPage());
    }
  }
}
```

## 5.2 Navigation Extensions
```dart
// core/utils/extensions.dart
extension NavigationExtension on BuildContext {
  void go(String route, {Object? arguments}) {
    Navigator.pushNamed(this, route, arguments: arguments);
  }

  void goReplacement(String route, {Object? arguments}) {
    Navigator.pushReplacementNamed(this, route, arguments: arguments);
  }

  void goAndRemoveUntil(String route, {Object? arguments}) {
    Navigator.pushNamedAndRemoveUntil(
      this,
      route,
      (route) => false,
      arguments: arguments,
    );
  }

  void pop<T>([T? result]) {
    Navigator.pop(this, result);
  }

  void showBottomSheet(Widget child) {
    showModalBottomSheet(
      context: this,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => child,
    );
  }

  void showErrorSnackbar(String message) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppColors.error,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void showSuccessSnackbar(String message) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppColors.success,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
```

---

# 6. Tema ve Stil

## 6.1 Tema Tanımlamaları
```dart
// config/theme.dart
class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        surface: AppColors.surface,
        error: AppColors.error,
        onPrimary: AppColors.onPrimary,
        onSecondary: AppColors.onSecondary,
        onSurface: AppColors.onSurface,
        onError: AppColors.onError,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: AppColors.onBackground,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: AppColors.onPrimary,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: const BorderSide(color: AppColors.error, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.md,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.surface,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.onSurfaceVariant,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}
```

## 6.2 Renkler
```dart
// config/constants.dart
class AppColors {
  AppColors._();

  // Primary
  static const Color primary = Color(0xFF6366F1);
  static const Color primaryVariant = Color(0xFF818CF8);
  static const Color onPrimary = Color(0xFFFFFFFF);

  // Secondary
  static const Color secondary = Color(0xFF10B981);
  static const Color secondaryVariant = Color(0xFF34D399);
  static const Color onSecondary = Color(0xFFFFFFFF);

  // Background
  static const Color background = Color(0xFF0A0A0A);
  static const Color onBackground = Color(0xFFFFFFFF);

  // Surface
  static const Color surface = Color(0xFF1A1A1A);
  static const Color surfaceVariant = Color(0xFF2A2A2A);
  static const Color onSurface = Color(0xFFE5E5E5);
  static const Color onSurfaceVariant = Color(0xFFA3A3A3);

  // Error
  static const Color error = Color(0xFFEF4444);
  static const Color onError = Color(0xFFFFFFFF);

  // Success
  static const Color success = Color(0xFF10B981);

  // Warning
  static const Color warning = Color(0xFFF59E0B);

  // Info
  static const Color info = Color(0xFF3B82F6);
}
```

## 6.3 Spacing ve Radius
```dart
// config/constants.dart
class AppSpacing {
  AppSpacing._();

  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
  static const double xxl = 32;
  static const double xxxl = 48;
}

class AppRadius {
  AppRadius._();

  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
  static const double full = 999;
}
```

---

# 7. Validasyon

## 7.1 Form Validatörleri
```dart
// core/utils/validators.dart
class Validators {
  Validators._();

  static String? phoneValidator(String? value) {
    if (value == null || value.isEmpty) {
      return 'Telefon numarası gerekli';
    }
    final regex = RegExp(r'^\+90[0-9]{10}$');
    if (!regex.hasMatch(value)) {
      return 'Geçersiz telefon formatı';
    }
    return null;
  }

  static String? emailValidator(String? value) {
    if (value == null || value.isEmpty) {
      return null; // Optional
    }
    final regex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!regex.hasMatch(value)) {
      return 'Geçersiz e-posta formatı';
    }
    return null;
  }

  static String? passwordValidator(String? value) {
    if (value == null || value.isEmpty) {
      return 'Şifre gerekli';
    }
    if (value.length < 8) {
      return 'Şifre en az 8 karakter olmalı';
    }
    if (!value.contains(RegExp(r'[A-Z]'))) {
      return 'En az bir büyük harf içermeli';
    }
    if (!value.contains(RegExp(r'[a-z]'))) {
      return 'En az bir küçük harf içermeli';
    }
    if (!value.contains(RegExp(r'[0-9]'))) {
      return 'En az bir rakam içermeli';
    }
    return null;
  }

  static String? requiredValidator(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName gerekli';
    }
    return null;
  }

  static String? minLengthValidator(String? value, int minLength, String fieldName) {
    if (value == null || value.length < minLength) {
      return '$fieldName en az $minLength karakter olmalı';
    }
    return null;
  }

  static String? maxLengthValidator(String? value, int maxLength, String fieldName) {
    if (value != null && value.length > maxLength) {
      return '$fieldName en fazla $maxLength karakter olabilir';
    }
    return null;
  }
}
```

---

# 8. API Client

## 8.1 Dio Yapılandırması
```dart
// core/network/dio_interceptor.dart
class DioInterceptor extends Interceptor {
  final AuthLocalDataSource _authLocal;
  final NetworkInfo _networkInfo;

  DioInterceptor(this._authLocal, this._networkInfo);

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    if (!await _networkInfo.isConnected) {
      handler.reject(
        DioException(
          requestOptions: options,
          error: 'No internet connection',
          type: DioExceptionType.connectionError,
        ),
      );
      return;
    }

    final token = await _authLocal.getToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    options.headers['Content-Type'] = 'application/json';
    options.headers['Accept'] = 'application/json';

    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    handler.next(response);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      // Token refresh logic
      final refreshed = await _refreshToken();
      if (refreshed) {
        final token = await _authLocal.getToken();
        err.requestOptions.headers['Authorization'] = 'Bearer $token';
        final response = await Dio().fetch(err.requestOptions);
        handler.resolve(response);
        return;
      }
    }

    handler.next(err);
  }

  Future<bool> _refreshToken() async {
    // Token refresh implementation
    return false;
  }
}
```

## 8.2 API Client
```dart
// core/network/api_client.dart
class ApiClient {
  final Dio _dio;

  ApiClient(this._dio);

  Future<T> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.get<T>(
        path,
        queryParameters: queryParameters,
      );
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<T> post<T>(
    String path, {
    dynamic data,
  }) async {
    try {
      final response = await _dio.post<T>(path, data: data);
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<T> patch<T>(
    String path, {
    dynamic data,
  }) async {
    try {
      final response = await _dio.patch<T>(path, data: data);
      return response.data as T;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> delete(String path) async {
    try {
      await _dio.delete(path);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  ApiException _handleError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return NetworkException('Connection timeout');
      case DioExceptionType.connectionError:
        return NetworkException('No internet connection');
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final message = error.response?.data?['error']?['message'] ?? 'Unknown error';
        return ServerException(message, statusCode: statusCode);
      default:
        return ServerException('Something went wrong');
    }
  }
}
```

---

# 9. Dependency Injection

## 9.1 GetIt Yapılandırması
```dart
// core/di/injection.dart
final sl = GetIt.instance;

Future<void> init() async {
  // External
  sl.registerLazySingleton(() => Dio(BaseOptions(
    baseUrl: Env.apiBaseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
  )));
  sl.registerLazySingleton(() => InternetConnectionChecker());
  sl.registerLazySingleton(() => SharedPreferences.getInstance());

  // Core
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(sl()));
  sl.registerLazySingleton(() => ApiClient(sl()));

  // Data Sources
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(sl()),
  );
  sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(sl()),
  );
  sl.registerLazySingleton<EventRemoteDataSource>(
    () => EventRemoteDataSourceImpl(sl()),
  );

  // Repositories
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
      networkInfo: sl(),
    ),
  );
  sl.registerLazySingleton<EventRepository>(
    () => EventRepositoryImpl(
      remoteDataSource: sl(),
      networkInfo: sl(),
    ),
  );

  // Use Cases
  sl.registerLazySingleton(() => LoginUseCase(sl()));
  sl.registerLazySingleton(() => RegisterUseCase(sl()));
  sl.registerLazySingleton(() => VerifyOtpUseCase(sl()));
  sl.registerLazySingleton(() => GetEventsUseCase(sl()));
  sl.registerLazySingleton(() => CreateEventUseCase(sl()));

  // BLoCs
  sl.registerFactory(() => AuthBloc(
    loginUseCase: sl(),
    registerUseCase: sl(),
    verifyOtpUseCase: sl(),
  ));
  sl.registerFactory(() => EventsBloc(
    getEventsUseCase: sl(),
    createEventUseCase: sl(),
  ));
}
```

---

# 10. Testing

## 10.1 Widget Test
```dart
// test/presentation/pages/login_page_test.dart
void main() {
  late AuthBloc authBloc;

  setUp(() {
    authBloc = MockAuthBloc();
    whenListen(
      authBloc,
      Stream.fromIterable([const AuthInitial()]),
      initialState: const AuthInitial(),
    );
  });

  Widget createWidgetUnderTest() {
    return MaterialApp(
      home: BlocProvider<AuthBloc>.value(
        value: authBloc,
        child: const LoginPage(),
      ),
    );
  }

  testWidgets('should display login form', (tester) async {
    await tester.pumpWidget(createWidgetUnderTest());

    expect(find.text('Giriş Yap'), findsOneWidget);
    expect(find.byType(PhoneInputField), findsOneWidget);
    expect(find.byType(PasswordInputField), findsOneWidget);
    expect(find.byType(PrimaryButton), findsOneWidget);
  });

  testWidgets('should show error when login fails', (tester) async {
    whenListen(
      authBloc,
      Stream.fromIterable([
        const AuthInitial(),
        const AuthLoading(),
        const AuthError(message: 'Invalid credentials'),
      ]),
      initialState: const AuthInitial(),
    );

    await tester.pumpWidget(createWidgetUnderTest());
    await tester.pump();

    expect(find.text('Invalid credentials'), findsOneWidget);
  });
}
```

## 10.2 BLoC Test
```dart
// test/presentation/blocs/auth_bloc_test.dart
void main() {
  late AuthBloc authBloc;
  late MockLoginUseCase mockLoginUseCase;

  setUp(() {
    mockLoginUseCase = MockLoginUseCase();
    authBloc = AuthBloc(
      loginUseCase: mockLoginUseCase,
      registerUseCase: MockRegisterUseCase(),
      verifyOtpUseCase: MockVerifyOtpUseCase(),
    );
  });

  tearDown(() {
    authBloc.close();
  });

  group('LoginRequested', () {
    const tUser = User(id: '1', phone: '+905551234567', ...);
    const tParams = LoginParams(phoneOrEmail: '+905551234567', password: 'test123');

    blocTest<AuthBloc, AuthState>(
      'should emit [AuthLoading, AuthAuthenticated] when login is successful',
      build: () {
        when(() => mockLoginUseCase(tParams))
            .thenAnswer((_) async => const Right(tUser));
        return authBloc;
      },
      act: (bloc) => bloc.add(const LoginRequested(
        phoneOrEmail: '+905551234567',
        password: 'test123',
      )),
      expect: () => [
        const AuthLoading(),
        const AuthAuthenticated(user: tUser),
      ],
      verify: (_) {
        verify(() => mockLoginUseCase(tParams)).called(1);
      },
    );

    blocTest<AuthBloc, AuthState>(
      'should emit [AuthLoading, AuthError] when login fails',
      build: () {
        when(() => mockLoginUseCase(tParams))
            .thenAnswer((_) async => Left(ServerFailure(message: 'Invalid credentials')));
        return authBloc;
      },
      act: (bloc) => bloc.add(const LoginRequested(
        phoneOrEmail: '+905551234567',
        password: 'wrong',
      )),
      expect: () => [
        const AuthLoading(),
        const AuthError(message: 'Invalid credentials'),
      ],
    );
  });
}
```

---

# 11. Performance Kuralları

## 11.1 const Constructor Kullanımı
```dart
// ✅ İyi
const Text('Hello');
const SizedBox(height: 16);
const EdgeInsets.all(16);

// ❌ Kötü
Text('Hello');
SizedBox(height: 16);
EdgeInsets.all(16);
```

## 11.2 ListView.builder Kullanımı
```dart
// ✅ İyi - Lazy loading
ListView.builder(
  itemCount: events.length,
  itemBuilder: (context, index) {
    return EventCard(event: events[index]);
  },
)

// ❌ Kötü - Tüm widget'lar aynı anda oluşturulur
ListView(
  children: events.map((e) => EventCard(event: e)).toList(),
)
```

## 11.3 Image Caching
```dart
// CachedNetworkImage kullan
CachedNetworkImage(
  imageUrl: event.imageUrl,
  placeholder: (context, url) => const SkeletonLoader(),
  errorWidget: (context, url, error) => const Icon(Icons.error),
  memCacheWidth: 600,
  memCacheHeight: 400,
)
```

## 11.4 Debounce ve Throttle
```dart
// Search debounce
final _searchDebouncer = Debouncer(milliseconds: 300);

void onSearchChanged(String query) {
  _searchDebouncer.run(() {
    context.read<EventsBloc>().add(SearchEvents(query: query));
  });
}
```

## 11.5 Avoid setState in build
```dart
// ❌ Kötü
@override
Widget build(BuildContext context) {
  setState(() {}); // NEVER DO THIS
  return Container();
}
```

---

# 12. Localization

## 12.1 ARB Dosyaları
```json
// lib/l10n/app_en.arb
{
  "@@locale": "en",
  "appName": "Loopin",
  "loginTitle": "Login",
  "registerTitle": "Register",
  "phoneLabel": "Phone Number",
  "passwordLabel": "Password",
  "submitButton": "Submit",
  "errorRequired": "This field is required",
  "errorInvalidPhone": "Invalid phone number"
}

// lib/l10n/app_tr.arb
{
  "@@locale": "tr",
  "appName": "Loopin",
  "loginTitle": "Giriş Yap",
  "registerTitle": "Kayıt Ol",
  "phoneLabel": "Telefon Numarası",
  "passwordLabel": "Şifre",
  "submitButton": "Gönder",
  "errorRequired": "Bu alan zorunludur",
  "errorInvalidPhone": "Geçersiz telefon numarası"
}
```

## 12.2 Kullanım
```dart
// Widget içinde
Text(AppLocalizations.of(context)!.loginTitle);

// Validator içinde
Validators.requiredValidator(value, AppLocalizations.of(context)!.phoneLabel);
```

---

# 13. Asset Yönetimi

## 13.1 Asset Tanımlamaları
```yaml
# pubspec.yaml
flutter:
  assets:
    - assets/images/
    - assets/icons/
    - assets/animations/
  fonts:
    - family: Inter
      fonts:
        - asset: assets/fonts/Inter-Regular.ttf
        - asset: assets/fonts/Inter-Medium.ttf
          weight: 500
        - asset: assets/fonts/Inter-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/Inter-Bold.ttf
          weight: 700
```

## 13.2 Asset Sınıfı
```dart
// generated/assets.dart
class AppAssets {
  AppAssets._();

  static const String logo = 'assets/images/logo.png';
  static const String logoWhite = 'assets/images/logo_white.png';
  static const String onboarding1 = 'assets/images/onboarding_1.svg';
  static const String onboarding2 = 'assets/images/onboarding_2.svg';
  static const String onboarding3 = 'assets/images/onboarding_3.svg';
  static const String emptyEvents = 'assets/images/empty_events.svg';
  static const String emptyMessages = 'assets/images/empty_messages.svg';
  static const String errorState = 'assets/images/error_state.svg';
}
```

---

# 14. Error Handling

## 14.1 Failure Sınıfları
```dart
// core/errors/failures.dart
abstract class Failure {
  final String message;

  const Failure({this.message = 'Something went wrong'});
}

class ServerFailure extends Failure {
  const ServerFailure({super.message});
}

class NetworkFailure extends Failure {
  const NetworkFailure({super.message = 'No internet connection'});
}

class UnauthorizedFailure extends Failure {
  const UnauthorizedFailure({super.message = 'Session expired'});
}

class ValidationFailure extends Failure {
  final Map<String, String> errors;

  const ValidationFailure({required this.errors, super.message});
}
```

## 14.2 Error Widget'ları
```dart
// presentation/widgets/common/error_state.dart
class ErrorStateWidget extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;

  const ErrorStateWidget({
    super.key,
    required this.message,
    this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SvgPicture.asset(
            AppAssets.errorState,
            width: 120,
            height: 120,
          ),
          const SizedBox(height: AppSpacing.lg),
          Text(
            'Bir şeyler ters gitti',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            message,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppColors.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
          ),
          if (onRetry != null) ...[
            const SizedBox(height: AppSpacing.xl),
            PrimaryButton(
              onPressed: onRetry,
              label: 'Tekrar Dene',
            ),
          ],
        ],
      ),
    );
  }
}
```

---

# 15. WebSocket (Real-time Messaging)

```dart
// core/network/socket_client.dart
class SocketClient {
  late IO.Socket _socket;
  final String _token;

  SocketClient(this._token);

  void connect() {
    _socket = IO.io(
      Env.socketBaseUrl,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': _token})
          .enableAutoConnect()
          .enableReconnection()
          .setReconnectionDelay(2000)
          .build(),
    );

    _socket.onConnect((_) {
      debugPrint('Socket connected');
    });

    _socket.onDisconnect((_) {
      debugPrint('Socket disconnected');
    });

    _socket.onError((error) {
      debugPrint('Socket error: $error');
    });
  }

  void joinRoom(String roomId) {
    _socket.emit('join_room', {'roomId': roomId});
  }

  void leaveRoom(String roomId) {
    _socket.emit('leave_room', {'roomId': roomId});
  }

  void sendMessage(String roomId, String content) {
    _socket.emit('send_message', {
      'roomId': roomId,
      'content': content,
    });
  }

  void sendTyping(String roomId, bool isTyping) {
    _socket.emit('typing', {
      'roomId': roomId,
      'isTyping': isTyping,
    });
  }

  void onNewMessage(void Function(Map<String, dynamic>) callback) {
    _socket.on('new_message', (data) => callback(data));
  }

  void onUserTyping(void Function(Map<String, dynamic>) callback) {
    _socket.on('user_typing', (data) => callback(data));
  }

  void disconnect() {
    _socket.disconnect();
  }
}
```

---

# SONUÇ

Bu Flutter geliştirme kuralları, Loopin mobil uygulaması için kodlama standartları, mimari prensipler ve best practice'leri tanımlar. Clean Architecture + BLoC pattern kullanılarak ölçeklenebilir ve bakımı kolay bir kod tabanı hedeflenmektedir.
"""

with open('/mnt/agents/output/08-Flutter-Rules.md', 'w', encoding='utf-8') as f:
    f.write(flutter_rules)

print("✅ 08-Flutter-Rules.md oluşturuldu")
