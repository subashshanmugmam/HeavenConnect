// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'api_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ApiResponse<T> _$ApiResponseFromJson<T>(
  Map<String, dynamic> json,
  T Function(Object? json) fromJsonT,
) =>
    $checkedCreate(
      'ApiResponse',
      json,
      ($checkedConvert) {
        final val = ApiResponse<T>(
          success: $checkedConvert('success', (v) => v as bool),
          message: $checkedConvert('message', (v) => v as String),
          data: $checkedConvert(
              'data', (v) => _$nullableGenericFromJson(v, fromJsonT)),
          errors: $checkedConvert('errors', (v) => v as Map<String, dynamic>?),
          statusCode:
              $checkedConvert('status_code', (v) => (v as num?)?.toInt()),
        );
        return val;
      },
      fieldKeyMap: const {'statusCode': 'status_code'},
    );

Map<String, dynamic> _$ApiResponseToJson<T>(
  ApiResponse<T> instance,
  Object? Function(T value) toJsonT,
) {
  final val = <String, dynamic>{
    'success': instance.success,
    'message': instance.message,
  };

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('data', _$nullableGenericToJson(instance.data, toJsonT));
  writeNotNull('errors', instance.errors);
  writeNotNull('status_code', instance.statusCode);
  return val;
}

T? _$nullableGenericFromJson<T>(
  Object? input,
  T Function(Object? json) fromJson,
) =>
    input == null ? null : fromJson(input);

Object? _$nullableGenericToJson<T>(
  T? input,
  Object? Function(T value) toJson,
) =>
    input == null ? null : toJson(input);
