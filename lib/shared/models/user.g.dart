// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

User _$UserFromJson(Map<String, dynamic> json) => $checkedCreate(
      'User',
      json,
      ($checkedConvert) {
        final val = User(
          id: $checkedConvert('id', (v) => v as String),
          email: $checkedConvert('email', (v) => v as String),
          name: $checkedConvert('name', (v) => v as String),
          profilePicture:
              $checkedConvert('profile_picture', (v) => v as String?),
          phoneNumber: $checkedConvert('phone_number', (v) => v as String?),
          address: $checkedConvert(
              'address',
              (v) => v == null
                  ? null
                  : UserAddress.fromJson(v as Map<String, dynamic>)),
          preferences: $checkedConvert('preferences',
              (v) => UserPreferences.fromJson(v as Map<String, dynamic>)),
          createdAt:
              $checkedConvert('created_at', (v) => DateTime.parse(v as String)),
          updatedAt:
              $checkedConvert('updated_at', (v) => DateTime.parse(v as String)),
        );
        return val;
      },
      fieldKeyMap: const {
        'profilePicture': 'profile_picture',
        'phoneNumber': 'phone_number',
        'createdAt': 'created_at',
        'updatedAt': 'updated_at'
      },
    );

Map<String, dynamic> _$UserToJson(User instance) {
  final val = <String, dynamic>{
    'id': instance.id,
    'email': instance.email,
    'name': instance.name,
  };

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('profile_picture', instance.profilePicture);
  writeNotNull('phone_number', instance.phoneNumber);
  writeNotNull('address', instance.address?.toJson());
  val['preferences'] = instance.preferences.toJson();
  val['created_at'] = instance.createdAt.toIso8601String();
  val['updated_at'] = instance.updatedAt.toIso8601String();
  return val;
}

UserAddress _$UserAddressFromJson(Map<String, dynamic> json) => $checkedCreate(
      'UserAddress',
      json,
      ($checkedConvert) {
        final val = UserAddress(
          street: $checkedConvert('street', (v) => v as String),
          city: $checkedConvert('city', (v) => v as String),
          state: $checkedConvert('state', (v) => v as String),
          zipCode: $checkedConvert('zip_code', (v) => v as String),
          country: $checkedConvert('country', (v) => v as String),
          latitude: $checkedConvert('latitude', (v) => (v as num).toDouble()),
          longitude: $checkedConvert('longitude', (v) => (v as num).toDouble()),
        );
        return val;
      },
      fieldKeyMap: const {'zipCode': 'zip_code'},
    );

Map<String, dynamic> _$UserAddressToJson(UserAddress instance) =>
    <String, dynamic>{
      'street': instance.street,
      'city': instance.city,
      'state': instance.state,
      'zip_code': instance.zipCode,
      'country': instance.country,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
    };

UserPreferences _$UserPreferencesFromJson(Map<String, dynamic> json) =>
    $checkedCreate(
      'UserPreferences',
      json,
      ($checkedConvert) {
        final val = UserPreferences(
          notificationsEnabled:
              $checkedConvert('notifications_enabled', (v) => v as bool),
          locationSharingEnabled:
              $checkedConvert('location_sharing_enabled', (v) => v as bool),
          darkModeEnabled:
              $checkedConvert('dark_mode_enabled', (v) => v as bool),
          language: $checkedConvert('language', (v) => v as String),
          interests: $checkedConvert('interests',
              (v) => (v as List<dynamic>).map((e) => e as String).toList()),
        );
        return val;
      },
      fieldKeyMap: const {
        'notificationsEnabled': 'notifications_enabled',
        'locationSharingEnabled': 'location_sharing_enabled',
        'darkModeEnabled': 'dark_mode_enabled'
      },
    );

Map<String, dynamic> _$UserPreferencesToJson(UserPreferences instance) =>
    <String, dynamic>{
      'notifications_enabled': instance.notificationsEnabled,
      'location_sharing_enabled': instance.locationSharingEnabled,
      'dark_mode_enabled': instance.darkModeEnabled,
      'language': instance.language,
      'interests': instance.interests,
    };
