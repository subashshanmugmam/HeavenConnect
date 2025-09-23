class AppConstants {
  // App Info
  static const String appName = 'HCSub';
  static const String appVersion = '1.0.0';
  static const String appDescription = 'Community Resource Sharing Platform';
  
  // API Configuration
  static const String baseUrl = 'https://api.hcsub.com';
  static const String apiVersion = 'v1';
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  
  // Storage Keys
  static const String userTokenKey = 'user_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userDataKey = 'user_data';
  static const String themeKey = 'theme_mode';
  static const String languageKey = 'language_code';
  static const String onboardingKey = 'onboarding_completed';
  static const String biometricEnabledKey = 'biometric_enabled';
  static const String locationPermissionKey = 'location_permission';
  static const String notificationSettingsKey = 'notification_settings';
  
  // Feature Flags
  static const bool enableBiometric = true;
  static const bool enableSocialLogin = true;
  static const bool enableVoiceCommands = true;
  static const bool enableARFeatures = true;
  static const bool enableIoTIntegration = true;
  static const bool enableOfflineMode = true;
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // Image/File Limits
  static const int maxImageSize = 10 * 1024 * 1024; // 10MB
  static const int maxVideoSize = 100 * 1024 * 1024; // 100MB
  static const int maxDocumentSize = 50 * 1024 * 1024; // 50MB
  static const List<String> allowedImageFormats = ['jpg', 'jpeg', 'png', 'webp'];
  static const List<String> allowedVideoFormats = ['mp4', 'avi', 'mov'];
  static const List<String> allowedDocumentFormats = ['pdf', 'doc', 'docx', 'txt'];
  
  // Animation Durations
  static const Duration shortAnimation = Duration(milliseconds: 150);
  static const Duration mediumAnimation = Duration(milliseconds: 300);
  static const Duration longAnimation = Duration(milliseconds: 500);
  
  // Map Configuration
  static const double defaultMapZoom = 15.0;
  static const double defaultLocationRadius = 5000.0; // 5km
  static const int maxNearbyItems = 50;
  
  // Chat Configuration
  static const int maxMessageLength = 1000;
  static const int maxGroupMembers = 100;
  static const Duration typingIndicatorTimeout = Duration(seconds: 3);
  
  // Booking Configuration
  static const Duration minBookingDuration = Duration(hours: 1);
  static const Duration maxBookingDuration = Duration(days: 30);
  static const int maxBookingsPerUser = 10;
  
  // Payment Configuration
  static const double minTransactionAmount = 1.0;
  static const double maxTransactionAmount = 10000.0;
  static const double platformFeePercentage = 0.05; // 5%
  
  // Community Configuration
  static const int maxCommunityMembers = 10000;
  static const double communityRadiusKm = 10.0;
  static const int maxEventsPerCommunity = 100;
  
  // Resource Configuration
  static const int maxResourcesPerUser = 50;
  static const int maxResourceImages = 10;
  static const Duration resourceAvailabilityWindow = Duration(days: 365);
  
  // IoT Configuration
  static const Duration deviceHeartbeatInterval = Duration(minutes: 5);
  static const Duration cameraStreamTimeout = Duration(seconds: 30);
  static const int maxDevicesPerUser = 20;
  
  // Notification Configuration
  static const String defaultNotificationSound = 'default';
  static const Duration notificationTimeout = Duration(seconds: 10);
  static const int maxNotificationHistory = 100;
  
  // Error Messages
  static const String networkErrorMessage = 'Network connection error. Please try again.';
  static const String serverErrorMessage = 'Server error. Please try again later.';
  static const String unauthorizedErrorMessage = 'Session expired. Please login again.';
  static const String locationErrorMessage = 'Location access denied. Please enable location services.';
  static const String cameraErrorMessage = 'Camera access denied. Please enable camera permissions.';
  static const String storageErrorMessage = 'Storage access denied. Please enable storage permissions.';
  
  // Success Messages
  static const String loginSuccessMessage = 'Login successful!';
  static const String registerSuccessMessage = 'Registration successful!';
  static const String resourceAddedMessage = 'Resource added successfully!';
  static const String bookingConfirmedMessage = 'Booking confirmed!';
  static const String paymentSuccessMessage = 'Payment processed successfully!';
  
  // Validation Rules
  static const int minPasswordLength = 8;
  static const int maxPasswordLength = 128;
  static const int minUsernameLength = 3;
  static const int maxUsernameLength = 30;
  static const int maxNameLength = 50;
  static const int maxDescriptionLength = 1000;
  static const int maxAddressLength = 200;
  
  // Regular Expressions
  static const String emailRegex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
  static const String phoneRegex = r'^\+?[1-9]\d{1,14}$';
  static const String passwordRegex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]';
  
  // Social Login Provider IDs
  static const String googleProviderId = 'google.com';
  static const String facebookProviderId = 'facebook.com';
  static const String appleProviderId = 'apple.com';
  static const String twitterProviderId = 'twitter.com';
  
  // Deep Link Schemes
  static const String appScheme = 'hcsub';
  static const String universalLinkDomain = 'hcsub.app';
  
  // Analytics Events
  static const String loginEvent = 'login';
  static const String registerEvent = 'register';
  static const String resourceViewEvent = 'resource_view';
  static const String bookingEvent = 'booking_create';
  static const String paymentEvent = 'payment_complete';
  static const String shareEvent = 'share';
  static const String searchEvent = 'search';
  
  // Cache Configuration
  static const Duration cacheExpiration = Duration(hours: 24);
  static const int maxCacheSize = 100 * 1024 * 1024; // 100MB
  static const int maxCacheEntries = 1000;
  
  // Background Tasks
  static const Duration syncInterval = Duration(minutes: 30);
  static const Duration locationUpdateInterval = Duration(minutes: 10);
  static const Duration deviceStatusCheckInterval = Duration(minutes: 5);
}

class RouteNames {
  // Authentication Routes
  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String resetPassword = '/reset-password';
  static const String phoneVerification = '/phone-verification';
  static const String biometricSetup = '/biometric-setup';
  
  // Main App Routes
  static const String home = '/home';
  static const String dashboard = '/dashboard';
  
  // Resource Routes
  static const String resources = '/resources';
  static const String resourceDetails = '/resources/:id';
  static const String addResource = '/resources/add';
  static const String editResource = '/resources/:id/edit';
  static const String resourceSearch = '/resources/search';
  static const String wishlist = '/wishlist';
  
  // Map Routes
  static const String map = '/map';
  static const String mapSearch = '/map/search';
  static const String locationPicker = '/location-picker';
  
  // Booking Routes
  static const String bookings = '/bookings';
  static const String bookingDetails = '/bookings/:id';
  static const String createBooking = '/resources/:id/book';
  static const String bookingHistory = '/bookings/history';
  
  // Chat Routes
  static const String chats = '/chats';
  static const String chatDetails = '/chats/:id';
  static const String groupChat = '/chats/group/:id';
  
  // IoT Routes
  static const String devices = '/devices';
  static const String deviceDetails = '/devices/:id';
  static const String addDevice = '/devices/add';
  static const String cameraFeed = '/devices/:id/camera';
  
  // Services Routes
  static const String services = '/services';
  static const String serviceDetails = '/services/:id';
  static const String addService = '/services/add';
  static const String serviceBooking = '/services/:id/book';
  
  // Spaces Routes
  static const String spaces = '/spaces';
  static const String spaceDetails = '/spaces/:id';
  static const String addSpace = '/spaces/add';
  static const String spaceBooking = '/spaces/:id/book';
  
  // Food Sharing Routes
  static const String foodSharing = '/food-sharing';
  static const String foodDetails = '/food-sharing/:id';
  static const String addFood = '/food-sharing/add';
  static const String communityMeals = '/food-sharing/meals';
  
  // Community Routes
  static const String community = '/community';
  static const String communityFeed = '/community/feed';
  static const String events = '/community/events';
  static const String eventDetails = '/community/events/:id';
  static const String createEvent = '/community/events/create';
  static const String polls = '/community/polls';
  static const String achievements = '/community/achievements';
  
  // Payment Routes
  static const String wallet = '/wallet';
  static const String payments = '/payments';
  static const String paymentHistory = '/payments/history';
  static const String addPaymentMethod = '/payments/add-method';
  
  // Profile Routes
  static const String profile = '/profile';
  static const String editProfile = '/profile/edit';
  static const String settings = '/settings';
  static const String notifications = '/settings/notifications';
  static const String privacy = '/settings/privacy';
  static const String security = '/settings/security';
  static const String help = '/help';
  static const String about = '/about';
  
  // Error Routes
  static const String notFound = '/404';
  static const String error = '/error';
}

class AssetPaths {
  // Images
  static const String imagesPath = 'assets/images/';
  static const String logo = '${imagesPath}logo.png';
  static const String logoTransparent = '${imagesPath}logo_transparent.png';
  static const String onboarding1 = '${imagesPath}onboarding_1.png';
  static const String onboarding2 = '${imagesPath}onboarding_2.png';
  static const String onboarding3 = '${imagesPath}onboarding_3.png';
  static const String placeholder = '${imagesPath}placeholder.png';
  static const String avatar = '${imagesPath}avatar.png';
  static const String errorImage = '${imagesPath}error.png';
  static const String noDataImage = '${imagesPath}no_data.png';
  
  // Icons
  static const String iconsPath = 'assets/icons/';
  static const String homeIcon = '${iconsPath}home.svg';
  static const String searchIcon = '${iconsPath}search.svg';
  static const String mapIcon = '${iconsPath}map.svg';
  static const String chatIcon = '${iconsPath}chat.svg';
  static const String profileIcon = '${iconsPath}profile.svg';
  static const String resourceIcon = '${iconsPath}resource.svg';
  static const String serviceIcon = '${iconsPath}service.svg';
  static const String spaceIcon = '${iconsPath}space.svg';
  static const String foodIcon = '${iconsPath}food.svg';
  static const String communityIcon = '${iconsPath}community.svg';
  static const String walletIcon = '${iconsPath}wallet.svg';
  static const String deviceIcon = '${iconsPath}device.svg';
  
  // Animations
  static const String animationsPath = 'assets/animations/';
  static const String loadingAnimation = '${animationsPath}loading.json';
  static const String successAnimation = '${animationsPath}success.json';
  static const String errorAnimation = '${animationsPath}error.json';
  static const String emptyAnimation = '${animationsPath}empty.json';
  static const String welcomeAnimation = '${animationsPath}welcome.json';
  static const String bookingAnimation = '${animationsPath}booking.json';
  static const String paymentAnimation = '${animationsPath}payment.json';
  
  // Fonts
  static const String fontsPath = 'assets/fonts/';
  static const String interRegular = '${fontsPath}Inter-Regular.ttf';
  static const String interMedium = '${fontsPath}Inter-Medium.ttf';
  static const String interSemiBold = '${fontsPath}Inter-SemiBold.ttf';
  static const String interBold = '${fontsPath}Inter-Bold.ttf';
}

class DatabaseTables {
  static const String users = 'users';
  static const String resources = 'resources';
  static const String bookings = 'bookings';
  static const String messages = 'messages';
  static const String chats = 'chats';
  static const String devices = 'devices';
  static const String services = 'services';
  static const String spaces = 'spaces';
  static const String foodItems = 'food_items';
  static const String communities = 'communities';
  static const String events = 'events';
  static const String payments = 'payments';
  static const String notifications = 'notifications';
  static const String reviews = 'reviews';
  static const String favorites = 'favorites';
  static const String categories = 'categories';
}

class HiveBoxes {
  static const String userBox = 'user_box';
  static const String resourceBox = 'resource_box';
  static const String bookingBox = 'booking_box';
  static const String chatBox = 'chat_box';
  static const String deviceBox = 'device_box';
  static const String settingsBox = 'settings_box';
  static const String cacheBox = 'cache_box';
  static const String notificationBox = 'notification_box';
}