// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserModel _$UserModelFromJson(Map<String, dynamic> json) => $checkedCreate(
      'UserModel',
      json,
      ($checkedConvert) {
        final val = UserModel(
          id: $checkedConvert('id', (v) => v as String),
          email: $checkedConvert('email', (v) => v as String),
          firstName: $checkedConvert('first_name', (v) => v as String?),
          lastName: $checkedConvert('last_name', (v) => v as String?),
          username: $checkedConvert('username', (v) => v as String?),
          phoneNumber: $checkedConvert('phone_number', (v) => v as String?),
          profileImageUrl:
              $checkedConvert('profile_image_url', (v) => v as String?),
          bio: $checkedConvert('bio', (v) => v as String?),
          address: $checkedConvert('address', (v) => v as String?),
          latitude: $checkedConvert('latitude', (v) => (v as num?)?.toDouble()),
          longitude:
              $checkedConvert('longitude', (v) => (v as num?)?.toDouble()),
          dateOfBirth: $checkedConvert('date_of_birth',
              (v) => v == null ? null : DateTime.parse(v as String)),
          role: $checkedConvert(
              'role',
              (v) =>
                  $enumDecodeNullable(_$UserRoleEnumMap, v) ?? UserRole.member),
          status: $checkedConvert(
              'status',
              (v) =>
                  $enumDecodeNullable(_$UserStatusEnumMap, v) ??
                  UserStatus.active),
          interests: $checkedConvert(
              'interests',
              (v) =>
                  (v as List<dynamic>?)?.map((e) => e as String).toList() ??
                  const []),
          preferences: $checkedConvert(
              'preferences', (v) => v as Map<String, dynamic>? ?? const {}),
          stats: $checkedConvert(
              'stats',
              (v) => v == null
                  ? const UserStats()
                  : UserStats.fromJson(v as Map<String, dynamic>)),
          createdAt:
              $checkedConvert('created_at', (v) => DateTime.parse(v as String)),
          updatedAt:
              $checkedConvert('updated_at', (v) => DateTime.parse(v as String)),
        );
        return val;
      },
      fieldKeyMap: const {
        'firstName': 'first_name',
        'lastName': 'last_name',
        'phoneNumber': 'phone_number',
        'profileImageUrl': 'profile_image_url',
        'dateOfBirth': 'date_of_birth',
        'createdAt': 'created_at',
        'updatedAt': 'updated_at'
      },
    );

Map<String, dynamic> _$UserModelToJson(UserModel instance) {
  final val = <String, dynamic>{
    'id': instance.id,
    'email': instance.email,
  };

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('first_name', instance.firstName);
  writeNotNull('last_name', instance.lastName);
  writeNotNull('username', instance.username);
  writeNotNull('phone_number', instance.phoneNumber);
  writeNotNull('profile_image_url', instance.profileImageUrl);
  writeNotNull('bio', instance.bio);
  writeNotNull('address', instance.address);
  writeNotNull('latitude', instance.latitude);
  writeNotNull('longitude', instance.longitude);
  writeNotNull('date_of_birth', instance.dateOfBirth?.toIso8601String());
  val['role'] = _$UserRoleEnumMap[instance.role]!;
  val['status'] = _$UserStatusEnumMap[instance.status]!;
  val['interests'] = instance.interests;
  val['preferences'] = instance.preferences;
  val['stats'] = instance.stats.toJson();
  val['created_at'] = instance.createdAt.toIso8601String();
  val['updated_at'] = instance.updatedAt.toIso8601String();
  return val;
}

const _$UserRoleEnumMap = {
  UserRole.member: 'member',
  UserRole.moderator: 'moderator',
  UserRole.admin: 'admin',
  UserRole.superAdmin: 'super_admin',
};

const _$UserStatusEnumMap = {
  UserStatus.active: 'active',
  UserStatus.inactive: 'inactive',
  UserStatus.suspended: 'suspended',
  UserStatus.pendingVerification: 'pending_verification',
};

UserStats _$UserStatsFromJson(Map<String, dynamic> json) => $checkedCreate(
      'UserStats',
      json,
      ($checkedConvert) {
        final val = UserStats(
          resourcesShared: $checkedConvert(
              'resources_shared', (v) => (v as num?)?.toInt() ?? 0),
          resourcesBorrowed: $checkedConvert(
              'resources_borrowed', (v) => (v as num?)?.toInt() ?? 0),
          servicesProvided: $checkedConvert(
              'services_provided', (v) => (v as num?)?.toInt() ?? 0),
          servicesUsed: $checkedConvert(
              'services_used', (v) => (v as num?)?.toInt() ?? 0),
          rating:
              $checkedConvert('rating', (v) => (v as num?)?.toDouble() ?? 0.0),
          reviewsCount: $checkedConvert(
              'reviews_count', (v) => (v as num?)?.toInt() ?? 0),
          communityPoints: $checkedConvert(
              'community_points', (v) => (v as num?)?.toInt() ?? 0),
          trustScore: $checkedConvert(
              'trust_score', (v) => (v as num?)?.toInt() ?? 100),
        );
        return val;
      },
      fieldKeyMap: const {
        'resourcesShared': 'resources_shared',
        'resourcesBorrowed': 'resources_borrowed',
        'servicesProvided': 'services_provided',
        'servicesUsed': 'services_used',
        'reviewsCount': 'reviews_count',
        'communityPoints': 'community_points',
        'trustScore': 'trust_score'
      },
    );

Map<String, dynamic> _$UserStatsToJson(UserStats instance) => <String, dynamic>{
      'resources_shared': instance.resourcesShared,
      'resources_borrowed': instance.resourcesBorrowed,
      'services_provided': instance.servicesProvided,
      'services_used': instance.servicesUsed,
      'rating': instance.rating,
      'reviews_count': instance.reviewsCount,
      'community_points': instance.communityPoints,
      'trust_score': instance.trustScore,
    };
