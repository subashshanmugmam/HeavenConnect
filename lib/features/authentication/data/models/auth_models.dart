import 'package:firebase_auth/firebase_auth.dart';
import 'package:equatable/equatable.dart';

/// Authentication result wrapper
class AuthResult extends Equatable {
  const AuthResult({
    required this.success,
    this.user,
    this.message,
    this.errorCode,
    this.accessToken,
    this.refreshToken,
    this.expiresIn,
    this.userData,
  });

  final bool success;
  final User? user;
  final String? message;
  final String? errorCode;
  final String? accessToken;
  final String? refreshToken;
  final int? expiresIn;
  final Map<String, dynamic>? userData;

  @override
  List<Object?> get props => [
        success,
        user,
        message,
        errorCode,
        accessToken,
        refreshToken,
        expiresIn,
        userData,
      ];

  factory AuthResult.fromJson(Map<String, dynamic> json) {
    return AuthResult(
      success: json['success'] ?? false,
      message: json['message'],
      errorCode: json['error_code'],
      accessToken: json['access_token'],
      refreshToken: json['refresh_token'],
      expiresIn: json['expires_in'],
      userData: json['user_data'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'error_code': errorCode,
      'access_token': accessToken,
      'refresh_token': refreshToken,
      'expires_in': expiresIn,
      'user_data': userData,
    };
  }

  // Convenience constructors
  factory AuthResult.success({
    User? user,
    String? accessToken,
    String? refreshToken,
    int? expiresIn,
    Map<String, dynamic>? userData,
  }) {
    return AuthResult(
      success: true,
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: expiresIn,
      userData: userData,
    );
  }

  factory AuthResult.failure({
    required String message,
    String? errorCode,
  }) {
    return AuthResult(
      success: false,
      message: message,
      errorCode: errorCode,
    );
  }
}

/// User profile data model
class UserProfile extends Equatable {
  const UserProfile({
    required this.uid,
    required this.email,
    this.firstName,
    this.lastName,
    this.displayName,
    this.photoURL,
    this.phoneNumber,
    this.birthDate,
    this.gender,
    this.address,
    this.preferences,
    this.security,
    this.isEmailVerified = false,
    this.isPhoneVerified = false,
    this.isProfileComplete = false,
    this.createdAt,
    this.updatedAt,
    this.lastLoginAt,
  });

  final String uid;
  final String email;
  final String? firstName;
  final String? lastName;
  final String? displayName;
  final String? photoURL;
  final String? phoneNumber;
  final DateTime? birthDate;
  final String? gender;
  final UserAddress? address;
  final UserPreferences? preferences;
  final SecuritySettings? security;
  final bool isEmailVerified;
  final bool isPhoneVerified;
  final bool isProfileComplete;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final DateTime? lastLoginAt;

  @override
  List<Object?> get props => [
        uid,
        email,
        firstName,
        lastName,
        displayName,
        photoURL,
        phoneNumber,
        birthDate,
        gender,
        address,
        preferences,
        security,
        isEmailVerified,
        isPhoneVerified,
        isProfileComplete,
        createdAt,
        updatedAt,
        lastLoginAt,
      ];

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      uid: json['uid'],
      email: json['email'],
      firstName: json['first_name'],
      lastName: json['last_name'],
      displayName: json['display_name'],
      photoURL: json['photo_url'],
      phoneNumber: json['phone_number'],
      birthDate: json['birth_date'] != null ? DateTime.parse(json['birth_date']) : null,
      gender: json['gender'],
      address: json['address'] != null ? UserAddress.fromJson(json['address']) : null,
      preferences: json['preferences'] != null ? UserPreferences.fromJson(json['preferences']) : null,
      security: json['security'] != null ? SecuritySettings.fromJson(json['security']) : null,
      isEmailVerified: json['is_email_verified'] ?? false,
      isPhoneVerified: json['is_phone_verified'] ?? false,
      isProfileComplete: json['is_profile_complete'] ?? false,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
      lastLoginAt: json['last_login_at'] != null ? DateTime.parse(json['last_login_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'uid': uid,
      'email': email,
      'first_name': firstName,
      'last_name': lastName,
      'display_name': displayName,
      'photo_url': photoURL,
      'phone_number': phoneNumber,
      'birth_date': birthDate?.toIso8601String(),
      'gender': gender,
      'address': address?.toJson(),
      'preferences': preferences?.toJson(),
      'security': security?.toJson(),
      'is_email_verified': isEmailVerified,
      'is_phone_verified': isPhoneVerified,
      'is_profile_complete': isProfileComplete,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
      'last_login_at': lastLoginAt?.toIso8601String(),
    };
  }
}

/// User address model
class UserAddress extends Equatable {
  const UserAddress({
    this.street,
    this.city,
    this.state,
    this.zipCode,
    this.country,
    this.latitude,
    this.longitude,
  });

  final String? street;
  final String? city;
  final String? state;
  final String? zipCode;
  final String? country;
  final double? latitude;
  final double? longitude;

  @override
  List<Object?> get props => [street, city, state, zipCode, country, latitude, longitude];

  factory UserAddress.fromJson(Map<String, dynamic> json) {
    return UserAddress(
      street: json['street'],
      city: json['city'],
      state: json['state'],
      zipCode: json['zip_code'],
      country: json['country'],
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'street': street,
      'city': city,
      'state': state,
      'zip_code': zipCode,
      'country': country,
      'latitude': latitude,
      'longitude': longitude,
    };
  }
}

/// User preferences model
class UserPreferences extends Equatable {
  const UserPreferences({
    this.emailNotifications = true,
    this.pushNotifications = true,
    this.smsNotifications = true,
    this.marketingEmails = false,
    this.language = 'en',
    this.theme = 'light',
    this.units = 'metric',
    this.privacySettings,
  });

  final bool emailNotifications;
  final bool pushNotifications;
  final bool smsNotifications;
  final bool marketingEmails;
  final String language;
  final String theme;
  final String units;
  final Map<String, bool>? privacySettings;

  @override
  List<Object?> get props => [
        emailNotifications,
        pushNotifications,
        smsNotifications,
        marketingEmails,
        language,
        theme,
        units,
        privacySettings,
      ];

  factory UserPreferences.fromJson(Map<String, dynamic> json) {
    return UserPreferences(
      emailNotifications: json['email_notifications'] ?? true,
      pushNotifications: json['push_notifications'] ?? true,
      smsNotifications: json['sms_notifications'] ?? true,
      marketingEmails: json['marketing_emails'] ?? false,
      language: json['language'] ?? 'en',
      theme: json['theme'] ?? 'light',
      units: json['units'] ?? 'metric',
      privacySettings: json['privacy_settings'] != null 
          ? Map<String, bool>.from(json['privacy_settings'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'email_notifications': emailNotifications,
      'push_notifications': pushNotifications,
      'sms_notifications': smsNotifications,
      'marketing_emails': marketingEmails,
      'language': language,
      'theme': theme,
      'units': units,
      'privacy_settings': privacySettings,
    };
  }
}

/// Security settings model
class SecuritySettings extends Equatable {
  const SecuritySettings({
    this.twoFactorEnabled = false,
    this.biometricEnabled = false,
    this.trustedDevices = const [],
    this.activeSessions = const [],
    this.lastPasswordChange,
    this.failedLoginAttempts = 0,
    this.accountLockedUntil,
    this.recoveryEmails = const [],
    this.recoveryPhones = const [],
  });

  final bool twoFactorEnabled;
  final bool biometricEnabled;
  final List<String> trustedDevices;
  final List<AuthSession> activeSessions;
  final DateTime? lastPasswordChange;
  final int failedLoginAttempts;
  final DateTime? accountLockedUntil;
  final List<String> recoveryEmails;
  final List<String> recoveryPhones;

  @override
  List<Object?> get props => [
        twoFactorEnabled,
        biometricEnabled,
        trustedDevices,
        activeSessions,
        lastPasswordChange,
        failedLoginAttempts,
        accountLockedUntil,
        recoveryEmails,
        recoveryPhones,
      ];

  factory SecuritySettings.fromJson(Map<String, dynamic> json) {
    return SecuritySettings(
      twoFactorEnabled: json['two_factor_enabled'] ?? false,
      biometricEnabled: json['biometric_enabled'] ?? false,
      trustedDevices: List<String>.from(json['trusted_devices'] ?? []),
      activeSessions: (json['active_sessions'] as List<dynamic>?)
          ?.map((session) => AuthSession.fromJson(session))
          .toList() ?? [],
      lastPasswordChange: json['last_password_change'] != null 
          ? DateTime.parse(json['last_password_change'])
          : null,
      failedLoginAttempts: json['failed_login_attempts'] ?? 0,
      accountLockedUntil: json['account_locked_until'] != null 
          ? DateTime.parse(json['account_locked_until'])
          : null,
      recoveryEmails: List<String>.from(json['recovery_emails'] ?? []),
      recoveryPhones: List<String>.from(json['recovery_phones'] ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'two_factor_enabled': twoFactorEnabled,
      'biometric_enabled': biometricEnabled,
      'trusted_devices': trustedDevices,
      'active_sessions': activeSessions.map((session) => session.toJson()).toList(),
      'last_password_change': lastPasswordChange?.toIso8601String(),
      'failed_login_attempts': failedLoginAttempts,
      'account_locked_until': accountLockedUntil?.toIso8601String(),
      'recovery_emails': recoveryEmails,
      'recovery_phones': recoveryPhones,
    };
  }
}

/// Authentication session model
class AuthSession extends Equatable {
  const AuthSession({
    required this.sessionId,
    required this.deviceId,
    required this.deviceName,
    required this.ipAddress,
    required this.userAgent,
    this.location,
    required this.createdAt,
    required this.lastActiveAt,
    this.expiresAt,
    this.isActive = true,
    this.isCurrent = false,
  });

  final String sessionId;
  final String deviceId;
  final String deviceName;
  final String ipAddress;
  final String userAgent;
  final String? location;
  final DateTime createdAt;
  final DateTime lastActiveAt;
  final DateTime? expiresAt;
  final bool isActive;
  final bool isCurrent;

  @override
  List<Object?> get props => [
        sessionId,
        deviceId,
        deviceName,
        ipAddress,
        userAgent,
        location,
        createdAt,
        lastActiveAt,
        expiresAt,
        isActive,
        isCurrent,
      ];

  factory AuthSession.fromJson(Map<String, dynamic> json) {
    return AuthSession(
      sessionId: json['session_id'],
      deviceId: json['device_id'],
      deviceName: json['device_name'],
      ipAddress: json['ip_address'],
      userAgent: json['user_agent'],
      location: json['location'],
      createdAt: DateTime.parse(json['created_at']),
      lastActiveAt: DateTime.parse(json['last_active_at']),
      expiresAt: json['expires_at'] != null ? DateTime.parse(json['expires_at']) : null,
      isActive: json['is_active'] ?? true,
      isCurrent: json['is_current'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'session_id': sessionId,
      'device_id': deviceId,
      'device_name': deviceName,
      'ip_address': ipAddress,
      'user_agent': userAgent,
      'location': location,
      'created_at': createdAt.toIso8601String(),
      'last_active_at': lastActiveAt.toIso8601String(),
      'expires_at': expiresAt?.toIso8601String(),
      'is_active': isActive,
      'is_current': isCurrent,
    };
  }
}

/// Authentication error model
class AuthError extends Equatable {
  const AuthError({
    required this.code,
    required this.message,
    this.details,
    this.stackTrace,
  });

  final String code;
  final String message;
  final Map<String, dynamic>? details;
  final String? stackTrace;

  @override
  List<Object?> get props => [code, message, details];

  @override
  String toString() => 'AuthError(code: $code, message: $message)';
}

/// Authentication state enum
enum AuthState {
  initial,
  loading,
  authenticated,
  unauthenticated,
  error,
  emailVerificationRequired,
  phoneVerificationRequired,
  twoFactorRequired,
  biometricRequired,
}

/// Authentication method enum
enum AuthMethod {
  emailPassword,
  google,
  facebook,
  apple,
  phone,
  biometric,
  anonymous,
}

/// Biometric type enum
enum BiometricType {
  none,
  fingerprint,
  face,
  iris,
  voice,
}

/// Account status enum
enum AccountStatus {
  active,
  inactive,
  suspended,
  deleted,
  pendingVerification,
}

/// Session status enum
enum SessionStatus {
  active,
  expired,
  revoked,
  invalid,
}