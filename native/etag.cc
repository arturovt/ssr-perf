#include <js_native_api.h>
#include <node_api.h>
#include <zlib.h>

#include <cstring>
#include <string>

const char* fast_path = "W/\"0\"";

napi_value etag(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value argv[1];
  napi_get_cb_info(env, info, &argc, argv, NULL, NULL);

  size_t buffer_length;
  void* buffer;
  napi_get_buffer_info(env, argv[0], &buffer, &buffer_length);

  napi_value result;

  if (buffer_length == 0) {
    // Fast-path for empty buffer.
    napi_create_string_utf8(env, fast_path, 5, &result);
    return result;
  }

  char* buffer_content = new char[buffer_length + 1]();
  // Faster than `memcpy` from `string.h`.
  std::memcpy(buffer_content, buffer, buffer_length);
  buffer_content[buffer_length] = '\n';

  // Calculate CRC-32 over the entire content.
  uint32_t crc = crc32(0L, Z_NULL, 0);
  crc = crc32(crc, reinterpret_cast<Bytef*>(buffer_content), buffer_length);

  delete[] buffer_content;

  // Create the final string.
  // `std::to_string` is faster than `std::format` and `std::stringstream`.
  std::string final =
      "W/\"" + std::to_string(buffer_length) + "-" + std::to_string(crc) + "\"";
  napi_create_string_utf8(env, final.c_str(), final.size(), &result);

  return result;
}

napi_value init(napi_env env, napi_value exports) {
  napi_value etag_fn;
  napi_create_function(env, NULL, NAPI_AUTO_LENGTH, etag, NULL, &etag_fn);
  napi_set_named_property(env, exports, "etag", etag_fn);

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
