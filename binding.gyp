{
  'targets': [
    {
      'target_name': 'etag',
      'defines': ['NDEBUG'],
      'sources': ['native/etag.cc'],
      'cflags_cc': ['-std=c++17', '-fexceptions', '-O3', '-Wall', '-Wextra'],
      'defines': ['NAPI_DISABLE_CPP_EXCEPTIONS']
    }
  ]
}
