import 'package:json_annotation/json_annotation.dart';
import 'package:equatable/equatable.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel extends Equatable {
  final String id;
  final String email;
  final String? firstName;
  final String? lastName;
  final String? username;
  final String? phoneNumber;
  final String? profileImageUrl;
  final String? bio;
  final String? address;
  final double? latitude;
  final double? longitude;
  final DateTime? dateOfBirth;
  final UserRole role;
  final UserStatus status;
  final List<String> interests;
  final Map<String, dynamic> preferences;
  final UserStats stats;
  final DateTime createdAt;
  final DateTime updatedAt;

  const UserModel({
    required this.id,
    required this.email,
    this.firstName,
    this.lastName,
    this.username,
    this.phoneNumber,
    this.profileImageUrl,
    this.bio,
    this.address,
    this.latitude,
    this.longitude,
    this.dateOfBirth,
    this.role = UserRole.member,
    this.status = UserStatus.active,
    this.interests = const [],
    this.preferences = const {},
    this.stats = const UserStats(),
    required this.createdAt,
    required this.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);
  Map<String, dynamic> toJson() => _$UserModelToJson(this);

  String get displayName {
    if (firstName != null && lastName != null) {
      return '$firstName $lastName';
    }
    return username ?? email.split('@').first;
  }

  String get initials {
    if (firstName != null && lastName != null) {
      return '${firstName!.substring(0, 1)}${lastName!.substring(0, 1)}'.toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  }

  bool get isProfileComplete {
    return firstName != null &&
        lastName != null &&
        phoneNumber != null &&
        address != null;
  }

  UserModel copyWith({
    String? id,
    String? email,
    String? firstName,
    String? lastName,
    String? username,
    String? phoneNumber,
    String? profileImageUrl,
    String? bio,
    String? address,
    double? latitude,
    double? longitude,
    DateTime? dateOfBirth,
    UserRole? role,
    UserStatus? status,
    List<String>? interests,
    Map<String, dynamic>? preferences,
    UserStats? stats,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      username: username ?? this.username,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      bio: bio ?? this.bio,
      address: address ?? this.address,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      role: role ?? this.role,
      status: status ?? this.status,
      interests: interests ?? this.interests,
      preferences: preferences ?? this.preferences,
      stats: stats ?? this.stats,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        email,
        firstName,
        lastName,
        username,
        phoneNumber,
        profileImageUrl,
        bio,
        address,
        latitude,
        longitude,
        dateOfBirth,
        role,
        status,
        interests,
        preferences,
        stats,
        createdAt,
        updatedAt,
      ];
}

@JsonSerializable()
class UserStats extends Equatable {
  final int resourcesShared;
  final int resourcesBorrowed;
  final int servicesProvided;
  final int servicesUsed;
  final double rating;
  final int reviewsCount;
  final int communityPoints;
  final int trustScore;

  const UserStats({
    this.resourcesShared = 0,
    this.resourcesBorrowed = 0,
    this.servicesProvided = 0,
    this.servicesUsed = 0,
    this.rating = 0.0,
    this.reviewsCount = 0,
    this.communityPoints = 0,
    this.trustScore = 100,
  });

  factory UserStats.fromJson(Map<String, dynamic> json) => _$UserStatsFromJson(json);
  Map<String, dynamic> toJson() => _$UserStatsToJson(this);

  UserStats copyWith({
    int? resourcesShared,
    int? resourcesBorrowed,
    int? servicesProvided,
    int? servicesUsed,
    double? rating,
    int? reviewsCount,
    int? communityPoints,
    int? trustScore,
  }) {
    return UserStats(
      resourcesShared: resourcesShared ?? this.resourcesShared,
      resourcesBorrowed: resourcesBorrowed ?? this.resourcesBorrowed,
      servicesProvided: servicesProvided ?? this.servicesProvided,
      servicesUsed: servicesUsed ?? this.servicesUsed,
      rating: rating ?? this.rating,
      reviewsCount: reviewsCount ?? this.reviewsCount,
      communityPoints: communityPoints ?? this.communityPoints,
      trustScore: trustScore ?? this.trustScore,
    );
  }

  @override
  List<Object?> get props => [
        resourcesShared,
        resourcesBorrowed,
        servicesProvided,
        servicesUsed,
        rating,
        reviewsCount,
        communityPoints,
        trustScore,
      ];
}

enum UserRole {
  @JsonValue('member')
  member,
  @JsonValue('moderator')
  moderator,
  @JsonValue('admin')
  admin,
  @JsonValue('super_admin')
  superAdmin,
}

enum UserStatus {
  @JsonValue('active')
  active,
  @JsonValue('inactive')
  inactive,
  @JsonValue('suspended')
  suspended,
  @JsonValue('pending_verification')
  pendingVerification,
}