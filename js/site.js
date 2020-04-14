(function () { /* header */
'use strict';
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/base64-js/lib/b64.js","/../../node_modules/base64-js/lib")
},{"buffer":2,"rH1JPG":4}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/buffer/index.js","/../../node_modules/buffer")
},{"base64-js":1,"buffer":2,"ieee754":3,"rH1JPG":4}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/ieee754/index.js","/../../node_modules/ieee754")
},{"buffer":2,"rH1JPG":4}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/process/browser.js","/../../node_modules/process")
},{"buffer":2,"rH1JPG":4}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){



}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/index.js","/")
},{"./modules/app-config":6,"./modules/backend":9,"./modules/calendar":13,"./modules/car":17,"./modules/comms":22,"./modules/contact":24,"./modules/date":27,"./modules/event":31,"./modules/home":37,"./modules/news":48,"./modules/site-config":54,"buffer":2,"rH1JPG":4}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

var appConfig = angular.module('app.config', [])
  .filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  })
  .filter('subset', function() {
    return function(input, start, end) {
      if (input) {
        return input.slice(start, end);
      }
      return [];
    }
  })
  .filter("nl2br", function($filter) {
 return function(data) {
   if (!data) return data;
   return data.replace(/\n\r?/g, '<br />');
 };
})
  .filter('iif', function() {
    return function(input, trueValue, falseValue) {
      return input ? trueValue : falseValue;
    };
  })
  .constant('lodash', window._)
  .constant('settings', {
    maxPerPageOptions: [2, 5, 10, 15, 50],
    pagesToDisplay: 5,
    snippetMaxLength: 200
  });

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/app-config/index.js","/modules/app-config")
},{"buffer":2,"rH1JPG":4}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var BackendController = function (backendService) {
  var self = this;

  backendService.getConfig().then(function(result) {
    self.version = result.version;
    console.log(self.version);
  });


};
module.exports = ['BackendService', BackendController];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/backend/controllers/BackendController.js","/modules/backend/controllers")
},{"buffer":2,"rH1JPG":4}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var dpConfig = function() {
  return {
    template: require('../partials/config.html'),
    controller: 'BackendController',
    controllerAs: 'backendController'
  };
};

module.exports = [dpConfig];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/backend/directives/dpConfig.js","/modules/backend/directives")
},{"../partials/config.html":10,"buffer":2,"rH1JPG":4}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var backendMod = angular.module('app.backend', ['app.comms']);
backendMod.controller('BackendController', require('./controllers/BackendController'));backendMod.directive('dpConfig', require('./directives/dpConfig'));backendMod.factory('BackendService', require('./services/BackendService'));
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/backend/index.js","/modules/backend")
},{"./controllers/BackendController":7,"./directives/dpConfig":8,"./services/BackendService":11,"buffer":2,"rH1JPG":4}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "Snapshot Version: {{backendController.version}}";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/backend/partials/config.html","/modules/backend/partials")
},{"buffer":2,"rH1JPG":4}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var BackendService = function (commsService) {
    var that = this;

    that.comms = commsService.getResource('config');

    that.getConfig = function() {
        return that.comms.getList().then(function(result) {
            return result.length > 0 ? result[0] : null;
        });
    };

    return that;
};

module.exports = ['CommsService', BackendService];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/backend/services/BackendService.js","/modules/backend/services")
},{"buffer":2,"rH1JPG":4}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var CalendarController = function(calendarService) {

  var self = this;

  this.list = calendarService.list();

}

module.exports = ['CalendarService', CalendarController];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/calendar/controllers/CalendarController.js","/modules/calendar/controllers")
},{"buffer":2,"rH1JPG":4}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var calendar = angular.module('app.calendar', ['ui.router', 'angularMoment']);
calendar.controller('CalendarController', require('./controllers/CalendarController'));calendar.factory('CalendarService', require('./services/CalendarService'));
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/calendar/index.js","/modules/calendar")
},{"./controllers/CalendarController":12,"./services/CalendarService":14,"buffer":2,"rH1JPG":4}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var CalendarService = function() {
  var self = this;

  self.list = function() {
    return [
        { title: 'Standup', description: 'description', category: 'category', dateFrom: 1581731046 },
        { title: 'Review', description: 'description', category: 'category', dateFrom: 1585736046 },
        { title: 'Retrospective', description: 'description', category: 'category', dateFrom: 1586736046 }
    ];
  };


  return self;
};

module.exports = [CalendarService];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/calendar/services/CalendarService.js","/modules/calendar/services")
},{"buffer":2,"rH1JPG":4}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/car/controllers/CarArticleController.js","/modules/car/controllers")
},{"buffer":2,"rH1JPG":4}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var CarController = function(list, $scope) {
    var self = this;

    self.list = list;

    var columnDefs = [
            {headerName: "Model", field: "makeModel"},
            {headerName: "MPG", field: "mpg"},
            {headerName: "CYL", field: "cyl"},
            {headerName: "DISP", field: "disp"},
            {headerName: "HP", field: "hp"},
            {headerName: "DRAT", field: "drat"},
            {headerName: "WT", field: "wt"},
            {headerName: "QSEC", field: "qsec"},
            {headerName: "VS", field: "vs"},
            {headerName: "AM", field: "am"},
            {headerName: "GEARS", field: "gear"},
            {headerName: "CARBON", field: "carb"},
        ];

    var currentRowHeight = 10;

        $scope.gridOptions = {
            columnDefs: columnDefs,
               defaultColDef: {
                    enableRowGroup: true,
                    enablePivot: true,
                    enableValue: true,
                    width: 100,
                    sortable: true,
                    resizable: true,
                    filter: true,
                    flex: 1,
                    minWidth: 100
                },
            rowData: list[0],
            onGridReady: function(params) {

                params.api.sizeColumnsToFit();
            },
            pagination: true,
            paginationPageSize: 20
        };

};

module.exports = ['list', '$scope', CarController];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/car/controllers/CarController.js","/modules/car/controllers")
},{"buffer":2,"rH1JPG":4}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var carMod = angular.module('app.car', ['ui.router', 'agGrid']);
carMod.controller('CarArticleController', require('./controllers/CarArticleController'));carMod.controller('CarController', require('./controllers/CarController'));carMod.factory('CarService', require('./services/CarService'));carMod.config(require('./routes/carRoutes'));
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/car/index.js","/modules/car")
},{"./controllers/CarArticleController":15,"./controllers/CarController":16,"./routes/carRoutes":20,"./services/CarService":21,"buffer":2,"rH1JPG":4}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/car/partials/carArticle.html","/modules/car/partials")
},{"buffer":2,"rH1JPG":4}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "<div id=myGrid ag-grid=gridOptions class=ag-theme-alpine style=\"width: 100%; height: 500px\"></div>";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/car/partials/cars.html","/modules/car/partials")
},{"buffer":2,"rH1JPG":4}],20:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var carRoutes = function($stateProvider) {
  $stateProvider
  .state('car', {
    url: '/car',
    template: require('../partials/cars.html'),
    resolve: {
      list: ['CarService', function(carService) {
        return carService.list();
      }]
    },
    controller: 'CarController',
    controllerAs: 'carCtrl'
  })
  .state('carArticle', {
    url: '/car/:id',
    template: require('../partials/carArticle.html'),
    resolve: {
      car: ['CarService', '$stateParams', function(carService, $stateParams) {
        return carService.get($stateParams.id);
      }]
    },
    controller: 'CarArticleController',
    controllerAs: 'carArticleCtrl'
  });
};

module.exports = ['$stateProvider', carRoutes];
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/car/routes/carRoutes.js","/modules/car/routes")
},{"../partials/carArticle.html":18,"../partials/cars.html":19,"buffer":2,"rH1JPG":4}],21:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var CarService = function (commsService) {
    var self = this;

    self.comms = commsService.getResource('car');

    self.list = function() {
        return self.comms.getList();
    };

    self.get = function(id) {
        return self.comms.get(id);
    }

    return self;
};

module.exports = ['CommsService', CarService];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/car/services/CarService.js","/modules/car/services")
},{"buffer":2,"rH1JPG":4}],22:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var commsModule = angular.module('app.comms', ['restangular', 'site.config'])
  .config(['RestangularProvider', 'siteConfig', function(RestangularProvider, siteConfig) {

    RestangularProvider.setBaseUrl(siteConfig.backendBase);

    RestangularProvider.setResponseInterceptor(function(data, operation, what, url, response, deferred) {
      console.log('Response', {
        data: data,
        operation: operation,
        what: what,
        url: url,
        response: response,
        deferred: deferred
      });

      if (operation === 'getList') {
        var newResponse = data.elements ? data.element : [data];

        if (data.meta) {
            newResponse.meta = {
              pageIndex: data.meta.pageIndex,
              maxPerPage: data.meta.maxPerPage,
              totalCount: data.meta.totalCount
            };
        }
        return newResponse;
      }
      return data;
    });
  }]);
commsModule.factory('CommsService', require('./services/CommsService'));
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/comms/index.js","/modules/comms")
},{"./services/CommsService":23,"buffer":2,"rH1JPG":4}],23:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var CommsService = function(Restangular, $location) {
  var that = this;

  Restangular.setRequestInterceptor(function(element, operation, route, url) {
    var requestHeader = {
      "Access-Control-Allow-Origin": "http://danieljamesfoley.co.uk/",
      "Content-Type": "application/x-www-form-urlencoded"
    };

    Restangular.setDefaultHeaders(requestHeader);

    console.log('Request', {
      element: element,
      operation: operation,
      route: route,
      url: url
    });
    return element;
  });

  that.getResource = function(resource) {
    return Restangular.all(resource);
  };

  Restangular.setErrorInterceptor(
    function(response) {
      if(response.status == 401) {
        tokenService.setToken('');
        $location.url('/login');
      }
    });

  return that;
};

module.exports = ['Restangular', '$location', CommsService];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/comms/services/CommsService.js","/modules/comms/services")
},{"buffer":2,"rH1JPG":4}],24:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var contactMod = angular.module('app.contact', ['ui.router']);
contactMod.config(require('./routes/contactRoutes'));
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/contact/index.js","/modules/contact")
},{"./routes/contactRoutes":26,"buffer":2,"rH1JPG":4}],25:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "<div class=row><div class=col-lg-12><h1 class=page-header>Contact Us</h1></div></div><div class=row><div class=col-md-12><h4>Email Us</h4><p><a href=maltio:example@example.com>example@example.com</a></p></div><div class=col-md-12><h4>Visit us</h4><p>This is where you put the location for the company</p></div></div>";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/contact/partials/contact.html","/modules/contact/partials")
},{"buffer":2,"rH1JPG":4}],26:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

var contactRoutes = function($stateProvider) {
  $stateProvider
    .state('contact', {
      url: '/contact',
      template: require('../partials/contact.html'),
    });
};

module.exports = ['$stateProvider', contactRoutes];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/contact/routes/contactRoutes.js","/modules/contact/routes")
},{"../partials/contact.html":25,"buffer":2,"rH1JPG":4}],27:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var mod = angular.module('app.date', ['angularMoment']);
mod.factory('DateService', require('./services/DateService'));
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/date/index.js","/modules/date")
},{"./services/DateService":28,"buffer":2,"rH1JPG":4}],28:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var DateService = function(momentService) {
  var that = this;
  that.monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  that.createDate = function(unix) {
    return new Date(unix*1000);
  };

  that.addDateAndTime = function(date, time) {
    var momentDate = moment(date),
        momentTime = moment(time);
    momentDate.add(momentTime.hours(), 'h');
    momentDate.add(momentTime.minutes(), 'm');
    return momentDate;
  };

  that.getUnix = function(date) {
    if(date.unix === 'function') {
      return date.unix();
    }
    return momentService(date).unix();
  };

  that.get = function() {
    var d = new Date();
    return Math.floor(d.getTime() / 1000);
  };

  that.getPastMonths = function(noOfMonths) {
    var d = new Date();
    var currentMonth = d.getMonth();
    var currentYear = d.getYear();
    var dateObj = null;
    var dateObjArr = [];

    for(var i = 0; i < noOfMonths; i++) {
      dateObj = getMonthDateRange(currentYear, currentMonth);
      dateObj.display = that.monthNames[currentMonth] + ' ' + (currentYear + 1900);

      if(currentMonth - 1 < 0) {
        currentMonth = that.monthNames.length - 1;
        currentYear--;
      } else {
        currentMonth--;
      }
      dateObjArr.push(dateObj);
    }
    return dateObjArr;
  };

  function getMonthDateRange(year, month) {
    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    var startDate = momentService([year, month]);
    startDate.add(1900, 'year');
    // Clone the value before .endOf()
    var endDate = momentService(startDate).endOf('month');

    // make sure to call toDate() for plain JavaScript date type
    return { start: startDate.unix(), end: endDate.unix() };
}

  return that;
};

module.exports = ['moment', DateService];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/date/services/DateService.js","/modules/date/services")
},{"buffer":2,"rH1JPG":4}],29:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var EventController = function (calendarService, dateService) {
  var that = this;

  var currentDate = dateService.get();

  this.list = calendarService.list();

};
module.exports = ['CalendarService', 'DateService', EventController];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/event/controllers/EventController.js","/modules/event/controllers")
},{"buffer":2,"rH1JPG":4}],30:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var calendarEntry = function() {
    return {
        template: require('../partials/calendarEntry.html'),
        controller: 'EventController',
        controllerAs: 'eventCtrl'
    };
};

module.exports = calendarEntry;

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/event/directives/calendarEntry.js","/modules/event/directives")
},{"../partials/calendarEntry.html":32,"buffer":2,"rH1JPG":4}],31:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var eventMod = angular.module('app.event', ['ui.router', 'app.date', 'app.calendar']);
eventMod.controller('EventController', require('./controllers/EventController'));eventMod.directive('calendarEntry', require('./directives/calendarEntry'));eventMod.factory('EventService', require('./services/EventService'));
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/event/index.js","/modules/event")
},{"./controllers/EventController":29,"./directives/calendarEntry":30,"./services/EventService":33,"buffer":2,"rH1JPG":4}],32:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "<div data-ng-if=\"eventCtrl.list.length === 0\">No upcoming events</div><div data-ng-repeat=\"event in eventCtrl.list\" class=calendar-entry><div class=calendar-icon><div class=month>{{event.dateFrom * 1000 | date: 'MMM'}}</div><div class=year>{{event.dateFrom * 1000 | date: 'yyyy'}}</div></div><div class=calendar-info>{{event.title}}</div></div>";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/event/partials/calendarEntry.html","/modules/event/partials")
},{"buffer":2,"rH1JPG":4}],33:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var EventService = function () {
    var that = this;

    that.list = function() {
      return [
      ]
    };

    return that;
};

module.exports = [EventService];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/event/services/EventService.js","/modules/event/services")
},{"buffer":2,"rH1JPG":4}],34:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var HomeController = function() {
  var that = this;
};

module.exports = [HomeController];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/home/controllers/HomeController.js","/modules/home/controllers")
},{"buffer":2,"rH1JPG":4}],35:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var UsefulLinksController = function() {
  var that = this;

  that.links = [
    {
      name: 'Dev Tools',
      links: [
        {
          name: 'Json Pretty',
          description: '',
          href: 'https://jsonformatter.curiousconcept.com/'
        },
        {
          name: 'Regex101',
          description: '',
          href: 'https://regex101.com/'
        },
        {
          name: 'Unix timestamp',
          description: '',
          href: 'https://www.unixtimestamp.com/'
        }
      ]
    },
    {
      name: 'Copy 1',
      links: [
        {
          name: 'Json Pretty',
          description: '',
          href: 'https://jsonformatter.curiousconcept.com/'
        },
        {
          name: 'Regex101',
          description: '',
          href: 'https://regex101.com/'
        },
        {
          name: 'Unix timestamp',
          description: '',
          href: 'https://www.unixtimestamp.com/'
        }
      ]
    },
    {
      name: 'Copy 2',
      links: [
        {
          name: 'Json Pretty',
          description: '',
          href: 'https://jsonformatter.curiousconcept.com/'
        },
        {
          name: 'Regex101',
          description: '',
          href: 'https://regex101.com/'
        },
        {
          name: 'Unix timestamp',
          description: '',
          href: 'https://www.unixtimestamp.com/'
        }
      ]
    }
  ];

  that.subset = that.links[0].links.slice(0, 3);
};

module.exports = [UsefulLinksController];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/home/controllers/UsefulLinksController.js","/modules/home/controllers")
},{"buffer":2,"rH1JPG":4}],36:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var footerLinks = function() {
  return {
    template: require('../partials/footer-useful-links.html'),
    controller: 'UsefulLinksController',
    controllerAs: 'usefulLinksCtrl'
  };
};

module.exports = [footerLinks];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/home/directives/gthFooterLinks.js","/modules/home/directives")
},{"../partials/footer-useful-links.html":39,"buffer":2,"rH1JPG":4}],37:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var homeModule = angular.module('app.home', ['app.date', 'ui.router']);
homeModule.controller('HomeController', require('./controllers/HomeController'));homeModule.controller('UsefulLinksController', require('./controllers/UsefulLinksController'));homeModule.directive('gthFooterLinks', require('./directives/gthFooterLinks'));homeModule.config(require('./routes/homeRoutes'));
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/home/index.js","/modules/home")
},{"./controllers/HomeController":34,"./controllers/UsefulLinksController":35,"./directives/gthFooterLinks":36,"./routes/homeRoutes":43,"buffer":2,"rH1JPG":4}],38:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "<div class=row><div class=col-lg-12><h1 class=page-header>Meet The Team</h1></div></div><div class=row><div class=\"col-md-7 col-sm-7 col-xs-12\"><a href=#><img class=img-responsive src=/images/team.jpeg alt=\"Meet our team\"></a></div><div class=\"col-md-5 col-sm-5 col-xs-12\"><h3>About Us</h3><p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.</p></div></div><hr>";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/home/partials/about.html","/modules/home/partials")
},{"buffer":2,"rH1JPG":4}],39:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "<p>Here are some useful links would you might be interested in<ul class=footer-useful-links><li ng-repeat=\"link in usefulLinksCtrl.subset\"><a ng-href={{link.href}} target=_blank>{{link.name}}</a></li></ul></p>";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/home/partials/footer-useful-links.html","/modules/home/partials")
},{"buffer":2,"rH1JPG":4}],40:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "<div class=page-title><h2>Demo application</h2></div><div class=\"row spacing\"><div class=col-md-12>\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"</div></div><div class=\"row spacing\"><div class=\"hidden-xs col-md-3\"><div class=section-title><h4>Calendar</h4></div><calendar-entry></calendar-entry></div><div class=\"col-md-6 col-xs-12\">1914 translation by H. Rackham \"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?\"<br><br>Section 1.10.33 of \"de Finibus Bonorum et Malorum\", written by Cicero in 45 BC \"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.\"<br><br>1914 translation by H. Rackham \"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.\"</div><div class=\"hidden-xs col-md-3\"><div class=section-title><h4>Connect with us</h4></div>Connect with us using the following information</div></div>";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/home/partials/home.html","/modules/home/partials")
},{"buffer":2,"rH1JPG":4}],41:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "<div class=row><div class=col-lg-12><h1 class=page-header>Useful Links</h1><p></p></div><div class=\"col-md-4 useful-links border-left\" ng-repeat=\"section in usefulLinksCtrl.links\" ng-class=\"$index >= 3 ?  'section-margin-padding' : '' \"><h3>{{section.name}}</h3><ul><li ng-repeat=\"link in section.links\"><a ng-href={{link.href}} target=_blank>{{link.name}}</a> <span ng-show=\"link.description.length > 0\" class=useful-link-description>- {{link.description}}</span></li></ul></div></div>";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/home/partials/links.html","/modules/home/partials")
},{"buffer":2,"rH1JPG":4}],42:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "<div class=row><div class=col-lg-12><h1 class=page-header>Our sponsors</h1></div></div><div class=row><div class=\"col-md-3 col-sm-7 col-xs-12\"><a href=http://facebook.co.uk/ title=# target=_blank><img src=images/facebooklogo.png class=sponsor alt=#></a></div><div class=\"col-md-9 col-sm-5 col-xs-12\"><h3><a href=http://hathways.co.uk/ >Facebook</a></h3><h4>Facebook</h4><p>\"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?\"</p></div></div><hr><div class=row><div class=\"col-md-3 col-sm-7 col-xs-12\"><a href=https://twitter.co.uk title=# target=_blank><img src=images/twitterlogo.png class=sponsor alt=#></a></div><div class=\"col-md-9 col-sm-5 col-xs-12\"><h3><a href=\"https://plus.google.com/112678932018297280892/about?gl=uk&hl=en\">Twitter</a></h3><h4>Twitter</h4><p>\"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.\"</p></div></div><hr><div class=row><div class=\"col-md-3 col-sm-7 col-xs-12\"><a href=http://google.co.uk/ title=# target=_blank><img src=images/googlelogo.jpg class=sponsor alt=#></a></div><div class=\"col-md-9 col-sm-5 col-xs-12\"><h3><a href=http://virgocarehomes.com/ >Google</a></h3><h4>Google</h4><p>\"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.\"</p></div></div>";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/home/partials/sponsors.html","/modules/home/partials")
},{"buffer":2,"rH1JPG":4}],43:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

var homeRoutes = function($stateProvider,  $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/',
    template: require('../partials/home.html'),
    controller: 'HomeController',
    controllerAs: 'homeCtrl'
  })
  .state('about', {
    url: '/about',
    template: require('../partials/about.html')
  })
  .state('sponsors', {
    url: '/sponsors',
    template: require('../partials/sponsors.html')
  })
  .state('links', {
    url: '/useful-links',
    template: require('../partials/links.html'),
    controller: 'UsefulLinksController',
    controllerAs: 'usefulLinksCtrl'
  });


   $urlRouterProvider.otherwise('/');
};

module.exports = ['$stateProvider', '$urlRouterProvider', homeRoutes];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/home/routes/homeRoutes.js","/modules/home/routes")
},{"../partials/about.html":38,"../partials/home.html":40,"../partials/links.html":41,"../partials/sponsors.html":42,"buffer":2,"rH1JPG":4}],44:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var NewsArticleController = function() {
  var self = this;
};

module.exports = [NewsArticleController];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/news/controllers/NewsArticleController.js","/modules/news/controllers")
},{"buffer":2,"rH1JPG":4}],45:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var NewsFeedController = function(list) {
  var self = this;

  self.meta = {
    totalCount: list.length,
    pageIndex: 1,
    maxPerPage: 2,
    noOfPages: 10,
    maxPerPageOpts: [1, 2, 3, 4, 5]
  };

  self.pageChanged = function() {};

  self.setMaxPerPage = function(opt) {
    self.meta.maxPerPage = opt;
  }

  self.list = list;
};

module.exports = ['list', NewsFeedController];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/news/controllers/NewsFeedController.js","/modules/news/controllers")
},{"buffer":2,"rH1JPG":4}],46:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var NewsPageController = function(article) {
  var self = this;
  self.article = article;
};

module.exports = ['article', NewsPageController];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/news/controllers/NewsPageController.js","/modules/news/controllers")
},{"buffer":2,"rH1JPG":4}],47:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var newsArticle = function() {
    return {
        template: require('../partials/newsArticle.html'),
        controller: 'NewsArticleController',
        controllerAs: 'newsArticleCtrl',
        restrict: 'E',
        scope: {
            article: '='
        },
        link: function(scope, element, attrs, ctrl) {
          ctrl.article = scope.article;
        }
    };
};

module.exports = [newsArticle];
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/news/directives/newsArticle.js","/modules/news/directives")
},{"../partials/newsArticle.html":49,"buffer":2,"rH1JPG":4}],48:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var newsModule = angular.module('app.news', ['ui.router', 'ui.bootstrap']);
newsModule.controller('NewsArticleController', require('./controllers/NewsArticleController'));newsModule.controller('NewsFeedController', require('./controllers/NewsFeedController'));newsModule.controller('NewsPageController', require('./controllers/NewsPageController'));newsModule.directive('newsArticle', require('./directives/newsArticle'));newsModule.factory('NewsService', require('./services/NewsService'));newsModule.config(require('./routes/newsRoutes'));
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/news/index.js","/modules/news")
},{"./controllers/NewsArticleController":44,"./controllers/NewsFeedController":45,"./controllers/NewsPageController":46,"./directives/newsArticle":47,"./routes/newsRoutes":52,"./services/NewsService":53,"buffer":2,"rH1JPG":4}],49:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "<h1><a ui-sref=\"newsArticle({id: article.id})\">{{article.title}}</a></h1><p class=lead>By Administrator</p><hr><p><span class=\"glyphicon glyphicon-time\"></span> Posted on {{article.created}}</p><hr><img class=img-responsive ng-src=/images/example-image.jpg alt=\"\"><hr><p class=lead>{{article.heading}}</p><p style=\"white-space: pre-line\">{{article.body}}</p>";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/news/partials/newsArticle.html","/modules/news/partials")
},{"buffer":2,"rH1JPG":4}],50:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "<div class=row><div class=col-lg-8><div class=row data-ng-repeat=\"news in newsFeedCtrl.list\"><div class=col-md-12><news-article article=news></news-article><hr></div></div><div class=row ng-show=\"newsFeedCtrl.list.length == 0\"><h3>No news articles available in this category, please clear your filters</h3><hr></div><uib-pagination total-items=newsFeedCtrl.meta.totalCount ng-model=newsFeedCtrl.meta.pageIndex items-per-page=newsFeedCtrl.meta.maxPerPage class=pagination-lg direction-links=false boundary-links=false data-ng-change=newsFeedCtrl.pageChanged() num-pages=newsFeedCtrl.meta.noOfPages></uib-pagination></div><div class=col-md-4><div class=well ng-show=\"newsFeedCtrl.meta.lowerBound === 0\"><h4>Blog Search</h4><div class=input-group><input type=text ng-model=newsFeedCtrl.search.term class=form-control> <span class=input-group-btn><button class=\"btn btn-default\" ng-click=newsFeedCtrl.search(newsFeedCtrl.search.term) type=button><span class=\"glyphicon glyphicon-search\"></span></button></span></div><div ng-show=newsFeedCtrl.search.selected>Search Term: {{newsDirectoryCtrl.state.search.selected}}</div><div ng-show=newsFeedCtrl.search.selected><button ng-click=newsDirectoryCtrl.clear() class=\"btn btn-primary news-clear-search-filter\" type=button>Clear search filter</button></div></div><div class=well><h4>Pages</h4><p><uib-pagination total-items=newsFeedCtrl.meta.totalCount ng-model=newsFeedCtrl.meta.pageIndex items-per-page=newsFeedCtrl.meta.maxPerPage class=pagination-sm direction-links=false boundary-links=false data-ng-change=newsFeedCtrl.pageChanged() num-pages=newsFeedCtrl.meta.noOfPages></uib-pagination></p><h4>Items per page</h4><p><nav><ul class=pagination><li data-ng-repeat=\"pageOpt in newsFeedCtrl.meta.maxPerPageOpts\" ng-class=\"pageOpt == newsFeedCtrl.meta.maxPerPage ? 'active': ''\"><a href=\"\" ng-click=newsFeedCtrl.setMaxPerPage(pageOpt)>{{pageOpt}}</a></li></ul></nav></p></div></div></div>";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/news/partials/newsFeed.html","/modules/news/partials")
},{"buffer":2,"rH1JPG":4}],51:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = "<div class=row><div class=col-lg-8><div class=row><div class=col-md-12><news-article article=newsPageCtrl.article></news-article><hr></div></div></div><div class=col-md-4><div class=well><h4>Share article</h4><p><a href=https://www.facebook.com/ target=_blank title=Facebook class=footer-facebook><img src=/images/facebook.png style=\"background-position: 0 -38px\"></a></p></div></div></div>";

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/news/partials/newsPage.html","/modules/news/partials")
},{"buffer":2,"rH1JPG":4}],52:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var newsRoutes = function($stateProvider) {
  $stateProvider
  .state('news', {
    url: '/news',
    template: require('../partials/newsFeed.html'),
    resolve: {
      list: ['NewsService', function(newsService) {
        return newsService.list();
      }]
    },
    controller: 'NewsFeedController',
    controllerAs: 'newsFeedCtrl'
  })
  .state('newsArticle', {
    url: '/news/:id',
    template: require('../partials/newsPage.html'),
    resolve: {
      article: ['NewsService', '$stateParams', function(newsService, $stateParams) {
        return newsService.get($stateParams.id);
      }]
    },
    controller: 'NewsPageController',
    controllerAs: 'newsPageCtrl'
  });
};

module.exports = ['$stateProvider', newsRoutes];
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/news/routes/newsRoutes.js","/modules/news/routes")
},{"../partials/newsFeed.html":50,"../partials/newsPage.html":51,"buffer":2,"rH1JPG":4}],53:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var NewsService = function (commsService) {
    var self = this;

    self.comms = commsService.getResource('news');

    self.list = function() {
        return self.comms.getList().then(function(data) {
            return data[0];
        });
    };

    self.get = function(id) {
        return self.comms.get(id);
    }

    return self;
};

module.exports = ['CommsService', NewsService];

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/news/services/NewsService.js","/modules/news/services")
},{"buffer":2,"rH1JPG":4}],54:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var siteConfig = angular.module('site.config', ['ezfb'])
  .constant('siteConfig', {
    root: 'http://danieljamesfoley.co.uk',
    backendBase: 'http://danieljamesfoley.co.uk/',
    appName: 'Demo Application',
    appVersion: 1
  });
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules/site-config/index.js","/modules/site-config")
},{"buffer":2,"rH1JPG":4}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vaW5kZXguanMiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvYXBwLWNvbmZpZy9pbmRleC5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9iYWNrZW5kL2NvbnRyb2xsZXJzL0JhY2tlbmRDb250cm9sbGVyLmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2JhY2tlbmQvZGlyZWN0aXZlcy9kcENvbmZpZy5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9iYWNrZW5kL2luZGV4LmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2JhY2tlbmQvcGFydGlhbHMvY29uZmlnLmh0bWwiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvYmFja2VuZC9zZXJ2aWNlcy9CYWNrZW5kU2VydmljZS5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9jYWxlbmRhci9jb250cm9sbGVycy9DYWxlbmRhckNvbnRyb2xsZXIuanMiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvY2FsZW5kYXIvaW5kZXguanMiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvY2FsZW5kYXIvc2VydmljZXMvQ2FsZW5kYXJTZXJ2aWNlLmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2Nhci9jb250cm9sbGVycy9DYXJBcnRpY2xlQ29udHJvbGxlci5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9jYXIvY29udHJvbGxlcnMvQ2FyQ29udHJvbGxlci5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9jYXIvaW5kZXguanMiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvY2FyL3BhcnRpYWxzL2NhckFydGljbGUuaHRtbCIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9jYXIvcGFydGlhbHMvY2Fycy5odG1sIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2Nhci9yb3V0ZXMvY2FyUm91dGVzLmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2Nhci9zZXJ2aWNlcy9DYXJTZXJ2aWNlLmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2NvbW1zL2luZGV4LmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2NvbW1zL3NlcnZpY2VzL0NvbW1zU2VydmljZS5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9jb250YWN0L2luZGV4LmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2NvbnRhY3QvcGFydGlhbHMvY29udGFjdC5odG1sIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2NvbnRhY3Qvcm91dGVzL2NvbnRhY3RSb3V0ZXMuanMiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvZGF0ZS9pbmRleC5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9kYXRlL3NlcnZpY2VzL0RhdGVTZXJ2aWNlLmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2V2ZW50L2NvbnRyb2xsZXJzL0V2ZW50Q29udHJvbGxlci5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9ldmVudC9kaXJlY3RpdmVzL2NhbGVuZGFyRW50cnkuanMiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvZXZlbnQvaW5kZXguanMiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvZXZlbnQvcGFydGlhbHMvY2FsZW5kYXJFbnRyeS5odG1sIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2V2ZW50L3NlcnZpY2VzL0V2ZW50U2VydmljZS5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9ob21lL2NvbnRyb2xsZXJzL0hvbWVDb250cm9sbGVyLmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2hvbWUvY29udHJvbGxlcnMvVXNlZnVsTGlua3NDb250cm9sbGVyLmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2hvbWUvZGlyZWN0aXZlcy9ndGhGb290ZXJMaW5rcy5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9ob21lL2luZGV4LmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2hvbWUvcGFydGlhbHMvYWJvdXQuaHRtbCIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9ob21lL3BhcnRpYWxzL2Zvb3Rlci11c2VmdWwtbGlua3MuaHRtbCIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9ob21lL3BhcnRpYWxzL2hvbWUuaHRtbCIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9ob21lL3BhcnRpYWxzL2xpbmtzLmh0bWwiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvaG9tZS9wYXJ0aWFscy9zcG9uc29ycy5odG1sIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL2hvbWUvcm91dGVzL2hvbWVSb3V0ZXMuanMiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvbmV3cy9jb250cm9sbGVycy9OZXdzQXJ0aWNsZUNvbnRyb2xsZXIuanMiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvbmV3cy9jb250cm9sbGVycy9OZXdzRmVlZENvbnRyb2xsZXIuanMiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvbmV3cy9jb250cm9sbGVycy9OZXdzUGFnZUNvbnRyb2xsZXIuanMiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvbmV3cy9kaXJlY3RpdmVzL25ld3NBcnRpY2xlLmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL25ld3MvaW5kZXguanMiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvbmV3cy9wYXJ0aWFscy9uZXdzQXJ0aWNsZS5odG1sIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL25ld3MvcGFydGlhbHMvbmV3c0ZlZWQuaHRtbCIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9uZXdzL3BhcnRpYWxzL25ld3NQYWdlLmh0bWwiLCIvVXNlcnMvZGFuaWVsZm9sZXkvZ2l0L2RlbW8tYXBwbGljYXRpb24vRnJvbnRlbmQtQW5ndWxhckpTL3RtcC9hbmd1bGFyLWFwcGxpY2F0aW9uL21vZHVsZXMvbmV3cy9yb3V0ZXMvbmV3c1JvdXRlcy5qcyIsIi9Vc2Vycy9kYW5pZWxmb2xleS9naXQvZGVtby1hcHBsaWNhdGlvbi9Gcm9udGVuZC1Bbmd1bGFySlMvdG1wL2FuZ3VsYXItYXBwbGljYXRpb24vbW9kdWxlcy9uZXdzL3NlcnZpY2VzL05ld3NTZXJ2aWNlLmpzIiwiL1VzZXJzL2RhbmllbGZvbGV5L2dpdC9kZW1vLWFwcGxpY2F0aW9uL0Zyb250ZW5kLUFuZ3VsYXJKUy90bXAvYW5ndWxhci1hcHBsaWNhdGlvbi9tb2R1bGVzL3NpdGUtY29uZmlnL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXHR2YXIgUExVU19VUkxfU0FGRSA9ICctJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSF9VUkxfU0FGRSA9ICdfJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMgfHxcblx0XHQgICAgY29kZSA9PT0gUExVU19VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0ggfHxcblx0XHQgICAgY29kZSA9PT0gU0xBU0hfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0ZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gKHRoaXMuYmFzZTY0anMgPSB7fSkgOiBleHBvcnRzKSlcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9idWZmZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IChlICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IChtICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKCh2YWx1ZSAqIGMpIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvaWVlZTc1NFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvcHJvY2Vzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnJlcXVpcmUoJy4vbW9kdWxlcy9zaXRlLWNvbmZpZycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL25ld3MnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9ob21lJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXZlbnQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9kYXRlJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29udGFjdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvbW1zJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY2FyJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY2FsZW5kYXInKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9iYWNrZW5kJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvYXBwLWNvbmZpZycpO1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG4gICdhcHAuY29uZmlnJyxcbiAgJ2FwcC5jb21tcycsXG4gICdhcHAubmV3cycsXG4gICdhcHAuY2FyJyxcbiAgJ2FwcC5iYWNrZW5kJyxcbiAgJ2FwcC5ob21lJyxcbiAgJ2FwcC5jb250YWN0JyxcbiAgJ2FwcC5jYWxlbmRhcicsXG4gICdhcHAuZXZlbnQnLFxuICAndWkuYm9vdHN0cmFwJyxcbiAgJ3VwZGF0ZU1ldGEnLFxuICAnc2l0ZS5jb25maWcnLFxuICAnYW5ndWxhcnRpY3MnLCAnYW5ndWxhcnRpY3MuZ29vZ2xlLmFuYWx5dGljcydcbl0pO1xuXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvaW5kZXguanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5cbnZhciBhcHBDb25maWcgPSBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKVxuICAuZmlsdGVyKCdjYXBpdGFsaXplJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICByZXR1cm4gKCEhaW5wdXQpID8gaW5wdXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKSA6ICcnO1xuICAgIH1cbiAgfSlcbiAgLmZpbHRlcignc3Vic2V0JywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBzdGFydCwgZW5kKSB7XG4gICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0LnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgfSlcbiAgLmZpbHRlcihcIm5sMmJyXCIsIGZ1bmN0aW9uKCRmaWx0ZXIpIHtcbiByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuICAgaWYgKCFkYXRhKSByZXR1cm4gZGF0YTtcbiAgIHJldHVybiBkYXRhLnJlcGxhY2UoL1xcblxccj8vZywgJzxiciAvPicpO1xuIH07XG59KVxuICAuZmlsdGVyKCdpaWYnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQsIHRydWVWYWx1ZSwgZmFsc2VWYWx1ZSkge1xuICAgICAgcmV0dXJuIGlucHV0ID8gdHJ1ZVZhbHVlIDogZmFsc2VWYWx1ZTtcbiAgICB9O1xuICB9KVxuICAuY29uc3RhbnQoJ2xvZGFzaCcsIHdpbmRvdy5fKVxuICAuY29uc3RhbnQoJ3NldHRpbmdzJywge1xuICAgIG1heFBlclBhZ2VPcHRpb25zOiBbMiwgNSwgMTAsIDE1LCA1MF0sXG4gICAgcGFnZXNUb0Rpc3BsYXk6IDUsXG4gICAgc25pcHBldE1heExlbmd0aDogMjAwXG4gIH0pO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvYXBwLWNvbmZpZy9pbmRleC5qc1wiLFwiL21vZHVsZXMvYXBwLWNvbmZpZ1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBCYWNrZW5kQ29udHJvbGxlciA9IGZ1bmN0aW9uIChiYWNrZW5kU2VydmljZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgYmFja2VuZFNlcnZpY2UuZ2V0Q29uZmlnKCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICBzZWxmLnZlcnNpb24gPSByZXN1bHQudmVyc2lvbjtcbiAgICBjb25zb2xlLmxvZyhzZWxmLnZlcnNpb24pO1xuICB9KTtcblxuXG59O1xubW9kdWxlLmV4cG9ydHMgPSBbJ0JhY2tlbmRTZXJ2aWNlJywgQmFja2VuZENvbnRyb2xsZXJdO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvYmFja2VuZC9jb250cm9sbGVycy9CYWNrZW5kQ29udHJvbGxlci5qc1wiLFwiL21vZHVsZXMvYmFja2VuZC9jb250cm9sbGVyc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBkcENvbmZpZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuLi9wYXJ0aWFscy9jb25maWcuaHRtbCcpLFxuICAgIGNvbnRyb2xsZXI6ICdCYWNrZW5kQ29udHJvbGxlcicsXG4gICAgY29udHJvbGxlckFzOiAnYmFja2VuZENvbnRyb2xsZXInXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFtkcENvbmZpZ107XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9iYWNrZW5kL2RpcmVjdGl2ZXMvZHBDb25maWcuanNcIixcIi9tb2R1bGVzL2JhY2tlbmQvZGlyZWN0aXZlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBiYWNrZW5kTW9kID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5iYWNrZW5kJywgWydhcHAuY29tbXMnXSk7XG5iYWNrZW5kTW9kLmNvbnRyb2xsZXIoJ0JhY2tlbmRDb250cm9sbGVyJywgcmVxdWlyZSgnLi9jb250cm9sbGVycy9CYWNrZW5kQ29udHJvbGxlcicpKTtiYWNrZW5kTW9kLmRpcmVjdGl2ZSgnZHBDb25maWcnLCByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvZHBDb25maWcnKSk7YmFja2VuZE1vZC5mYWN0b3J5KCdCYWNrZW5kU2VydmljZScsIHJlcXVpcmUoJy4vc2VydmljZXMvQmFja2VuZFNlcnZpY2UnKSk7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvYmFja2VuZC9pbmRleC5qc1wiLFwiL21vZHVsZXMvYmFja2VuZFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbm1vZHVsZS5leHBvcnRzID0gXCJTbmFwc2hvdCBWZXJzaW9uOiB7e2JhY2tlbmRDb250cm9sbGVyLnZlcnNpb259fVwiO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvYmFja2VuZC9wYXJ0aWFscy9jb25maWcuaHRtbFwiLFwiL21vZHVsZXMvYmFja2VuZC9wYXJ0aWFsc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBCYWNrZW5kU2VydmljZSA9IGZ1bmN0aW9uIChjb21tc1NlcnZpY2UpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGF0LmNvbW1zID0gY29tbXNTZXJ2aWNlLmdldFJlc291cmNlKCdjb25maWcnKTtcblxuICAgIHRoYXQuZ2V0Q29uZmlnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGF0LmNvbW1zLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5sZW5ndGggPiAwID8gcmVzdWx0WzBdIDogbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB0aGF0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBbJ0NvbW1zU2VydmljZScsIEJhY2tlbmRTZXJ2aWNlXTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2JhY2tlbmQvc2VydmljZXMvQmFja2VuZFNlcnZpY2UuanNcIixcIi9tb2R1bGVzL2JhY2tlbmQvc2VydmljZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgQ2FsZW5kYXJDb250cm9sbGVyID0gZnVuY3Rpb24oY2FsZW5kYXJTZXJ2aWNlKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHRoaXMubGlzdCA9IGNhbGVuZGFyU2VydmljZS5saXN0KCk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBbJ0NhbGVuZGFyU2VydmljZScsIENhbGVuZGFyQ29udHJvbGxlcl07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9jYWxlbmRhci9jb250cm9sbGVycy9DYWxlbmRhckNvbnRyb2xsZXIuanNcIixcIi9tb2R1bGVzL2NhbGVuZGFyL2NvbnRyb2xsZXJzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIGNhbGVuZGFyID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5jYWxlbmRhcicsIFsndWkucm91dGVyJywgJ2FuZ3VsYXJNb21lbnQnXSk7XG5jYWxlbmRhci5jb250cm9sbGVyKCdDYWxlbmRhckNvbnRyb2xsZXInLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL0NhbGVuZGFyQ29udHJvbGxlcicpKTtjYWxlbmRhci5mYWN0b3J5KCdDYWxlbmRhclNlcnZpY2UnLCByZXF1aXJlKCcuL3NlcnZpY2VzL0NhbGVuZGFyU2VydmljZScpKTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9jYWxlbmRhci9pbmRleC5qc1wiLFwiL21vZHVsZXMvY2FsZW5kYXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgQ2FsZW5kYXJTZXJ2aWNlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLmxpc3QgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICB7IHRpdGxlOiAnU3RhbmR1cCcsIGRlc2NyaXB0aW9uOiAnZGVzY3JpcHRpb24nLCBjYXRlZ29yeTogJ2NhdGVnb3J5JywgZGF0ZUZyb206IDE1ODE3MzEwNDYgfSxcbiAgICAgICAgeyB0aXRsZTogJ1JldmlldycsIGRlc2NyaXB0aW9uOiAnZGVzY3JpcHRpb24nLCBjYXRlZ29yeTogJ2NhdGVnb3J5JywgZGF0ZUZyb206IDE1ODU3MzYwNDYgfSxcbiAgICAgICAgeyB0aXRsZTogJ1JldHJvc3BlY3RpdmUnLCBkZXNjcmlwdGlvbjogJ2Rlc2NyaXB0aW9uJywgY2F0ZWdvcnk6ICdjYXRlZ29yeScsIGRhdGVGcm9tOiAxNTg2NzM2MDQ2IH1cbiAgICBdO1xuICB9O1xuXG5cbiAgcmV0dXJuIHNlbGY7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFtDYWxlbmRhclNlcnZpY2VdO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvY2FsZW5kYXIvc2VydmljZXMvQ2FsZW5kYXJTZXJ2aWNlLmpzXCIsXCIvbW9kdWxlcy9jYWxlbmRhci9zZXJ2aWNlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2Nhci9jb250cm9sbGVycy9DYXJBcnRpY2xlQ29udHJvbGxlci5qc1wiLFwiL21vZHVsZXMvY2FyL2NvbnRyb2xsZXJzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIENhckNvbnRyb2xsZXIgPSBmdW5jdGlvbihsaXN0LCAkc2NvcGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmxpc3QgPSBsaXN0O1xuXG4gICAgdmFyIGNvbHVtbkRlZnMgPSBbXG4gICAgICAgICAgICB7aGVhZGVyTmFtZTogXCJNb2RlbFwiLCBmaWVsZDogXCJtYWtlTW9kZWxcIn0sXG4gICAgICAgICAgICB7aGVhZGVyTmFtZTogXCJNUEdcIiwgZmllbGQ6IFwibXBnXCJ9LFxuICAgICAgICAgICAge2hlYWRlck5hbWU6IFwiQ1lMXCIsIGZpZWxkOiBcImN5bFwifSxcbiAgICAgICAgICAgIHtoZWFkZXJOYW1lOiBcIkRJU1BcIiwgZmllbGQ6IFwiZGlzcFwifSxcbiAgICAgICAgICAgIHtoZWFkZXJOYW1lOiBcIkhQXCIsIGZpZWxkOiBcImhwXCJ9LFxuICAgICAgICAgICAge2hlYWRlck5hbWU6IFwiRFJBVFwiLCBmaWVsZDogXCJkcmF0XCJ9LFxuICAgICAgICAgICAge2hlYWRlck5hbWU6IFwiV1RcIiwgZmllbGQ6IFwid3RcIn0sXG4gICAgICAgICAgICB7aGVhZGVyTmFtZTogXCJRU0VDXCIsIGZpZWxkOiBcInFzZWNcIn0sXG4gICAgICAgICAgICB7aGVhZGVyTmFtZTogXCJWU1wiLCBmaWVsZDogXCJ2c1wifSxcbiAgICAgICAgICAgIHtoZWFkZXJOYW1lOiBcIkFNXCIsIGZpZWxkOiBcImFtXCJ9LFxuICAgICAgICAgICAge2hlYWRlck5hbWU6IFwiR0VBUlNcIiwgZmllbGQ6IFwiZ2VhclwifSxcbiAgICAgICAgICAgIHtoZWFkZXJOYW1lOiBcIkNBUkJPTlwiLCBmaWVsZDogXCJjYXJiXCJ9LFxuICAgICAgICBdO1xuXG4gICAgdmFyIGN1cnJlbnRSb3dIZWlnaHQgPSAxMDtcblxuICAgICAgICAkc2NvcGUuZ3JpZE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBjb2x1bW5EZWZzOiBjb2x1bW5EZWZzLFxuICAgICAgICAgICAgICAgZGVmYXVsdENvbERlZjoge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVSb3dHcm91cDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlUGl2b3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZVZhbHVlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgICAgICAgIG1pbldpZHRoOiAxMDBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm93RGF0YTogbGlzdFswXSxcbiAgICAgICAgICAgIG9uR3JpZFJlYWR5OiBmdW5jdGlvbihwYXJhbXMpIHtcblxuICAgICAgICAgICAgICAgIHBhcmFtcy5hcGkuc2l6ZUNvbHVtbnNUb0ZpdCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhZ2luYXRpb246IHRydWUsXG4gICAgICAgICAgICBwYWdpbmF0aW9uUGFnZVNpemU6IDIwXG4gICAgICAgIH07XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gWydsaXN0JywgJyRzY29wZScsIENhckNvbnRyb2xsZXJdO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvY2FyL2NvbnRyb2xsZXJzL0NhckNvbnRyb2xsZXIuanNcIixcIi9tb2R1bGVzL2Nhci9jb250cm9sbGVyc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBjYXJNb2QgPSBhbmd1bGFyLm1vZHVsZSgnYXBwLmNhcicsIFsndWkucm91dGVyJywgJ2FnR3JpZCddKTtcbmNhck1vZC5jb250cm9sbGVyKCdDYXJBcnRpY2xlQ29udHJvbGxlcicsIHJlcXVpcmUoJy4vY29udHJvbGxlcnMvQ2FyQXJ0aWNsZUNvbnRyb2xsZXInKSk7Y2FyTW9kLmNvbnRyb2xsZXIoJ0NhckNvbnRyb2xsZXInLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL0NhckNvbnRyb2xsZXInKSk7Y2FyTW9kLmZhY3RvcnkoJ0NhclNlcnZpY2UnLCByZXF1aXJlKCcuL3NlcnZpY2VzL0NhclNlcnZpY2UnKSk7Y2FyTW9kLmNvbmZpZyhyZXF1aXJlKCcuL3JvdXRlcy9jYXJSb3V0ZXMnKSk7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvY2FyL2luZGV4LmpzXCIsXCIvbW9kdWxlcy9jYXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5tb2R1bGUuZXhwb3J0cyA9IFwiXCI7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9jYXIvcGFydGlhbHMvY2FyQXJ0aWNsZS5odG1sXCIsXCIvbW9kdWxlcy9jYXIvcGFydGlhbHNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5tb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBpZD1teUdyaWQgYWctZ3JpZD1ncmlkT3B0aW9ucyBjbGFzcz1hZy10aGVtZS1hbHBpbmUgc3R5bGU9XFxcIndpZHRoOiAxMDAlOyBoZWlnaHQ6IDUwMHB4XFxcIj48L2Rpdj5cIjtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2Nhci9wYXJ0aWFscy9jYXJzLmh0bWxcIixcIi9tb2R1bGVzL2Nhci9wYXJ0aWFsc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBjYXJSb3V0ZXMgPSBmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAuc3RhdGUoJ2NhcicsIHtcbiAgICB1cmw6ICcvY2FyJyxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vcGFydGlhbHMvY2Fycy5odG1sJyksXG4gICAgcmVzb2x2ZToge1xuICAgICAgbGlzdDogWydDYXJTZXJ2aWNlJywgZnVuY3Rpb24oY2FyU2VydmljZSkge1xuICAgICAgICByZXR1cm4gY2FyU2VydmljZS5saXN0KCk7XG4gICAgICB9XVxuICAgIH0sXG4gICAgY29udHJvbGxlcjogJ0NhckNvbnRyb2xsZXInLFxuICAgIGNvbnRyb2xsZXJBczogJ2NhckN0cmwnXG4gIH0pXG4gIC5zdGF0ZSgnY2FyQXJ0aWNsZScsIHtcbiAgICB1cmw6ICcvY2FyLzppZCcsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL3BhcnRpYWxzL2NhckFydGljbGUuaHRtbCcpLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGNhcjogWydDYXJTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uKGNhclNlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICByZXR1cm4gY2FyU2VydmljZS5nZXQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgIH1dXG4gICAgfSxcbiAgICBjb250cm9sbGVyOiAnQ2FyQXJ0aWNsZUNvbnRyb2xsZXInLFxuICAgIGNvbnRyb2xsZXJBczogJ2NhckFydGljbGVDdHJsJ1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gWyckc3RhdGVQcm92aWRlcicsIGNhclJvdXRlc107XG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvY2FyL3JvdXRlcy9jYXJSb3V0ZXMuanNcIixcIi9tb2R1bGVzL2Nhci9yb3V0ZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgQ2FyU2VydmljZSA9IGZ1bmN0aW9uIChjb21tc1NlcnZpY2UpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmNvbW1zID0gY29tbXNTZXJ2aWNlLmdldFJlc291cmNlKCdjYXInKTtcblxuICAgIHNlbGYubGlzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5jb21tcy5nZXRMaXN0KCk7XG4gICAgfTtcblxuICAgIHNlbGYuZ2V0ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY29tbXMuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gWydDb21tc1NlcnZpY2UnLCBDYXJTZXJ2aWNlXTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2Nhci9zZXJ2aWNlcy9DYXJTZXJ2aWNlLmpzXCIsXCIvbW9kdWxlcy9jYXIvc2VydmljZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgY29tbXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbW1zJywgWydyZXN0YW5ndWxhcicsICdzaXRlLmNvbmZpZyddKVxuICAuY29uZmlnKFsnUmVzdGFuZ3VsYXJQcm92aWRlcicsICdzaXRlQ29uZmlnJywgZnVuY3Rpb24oUmVzdGFuZ3VsYXJQcm92aWRlciwgc2l0ZUNvbmZpZykge1xuXG4gICAgUmVzdGFuZ3VsYXJQcm92aWRlci5zZXRCYXNlVXJsKHNpdGVDb25maWcuYmFja2VuZEJhc2UpO1xuXG4gICAgUmVzdGFuZ3VsYXJQcm92aWRlci5zZXRSZXNwb25zZUludGVyY2VwdG9yKGZ1bmN0aW9uKGRhdGEsIG9wZXJhdGlvbiwgd2hhdCwgdXJsLCByZXNwb25zZSwgZGVmZXJyZWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdSZXNwb25zZScsIHtcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgb3BlcmF0aW9uOiBvcGVyYXRpb24sXG4gICAgICAgIHdoYXQ6IHdoYXQsXG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICByZXNwb25zZTogcmVzcG9uc2UsXG4gICAgICAgIGRlZmVycmVkOiBkZWZlcnJlZFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChvcGVyYXRpb24gPT09ICdnZXRMaXN0Jykge1xuICAgICAgICB2YXIgbmV3UmVzcG9uc2UgPSBkYXRhLmVsZW1lbnRzID8gZGF0YS5lbGVtZW50IDogW2RhdGFdO1xuXG4gICAgICAgIGlmIChkYXRhLm1ldGEpIHtcbiAgICAgICAgICAgIG5ld1Jlc3BvbnNlLm1ldGEgPSB7XG4gICAgICAgICAgICAgIHBhZ2VJbmRleDogZGF0YS5tZXRhLnBhZ2VJbmRleCxcbiAgICAgICAgICAgICAgbWF4UGVyUGFnZTogZGF0YS5tZXRhLm1heFBlclBhZ2UsXG4gICAgICAgICAgICAgIHRvdGFsQ291bnQ6IGRhdGEubWV0YS50b3RhbENvdW50XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdSZXNwb25zZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0pO1xuICB9XSk7XG5jb21tc01vZHVsZS5mYWN0b3J5KCdDb21tc1NlcnZpY2UnLCByZXF1aXJlKCcuL3NlcnZpY2VzL0NvbW1zU2VydmljZScpKTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9jb21tcy9pbmRleC5qc1wiLFwiL21vZHVsZXMvY29tbXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgQ29tbXNTZXJ2aWNlID0gZnVuY3Rpb24oUmVzdGFuZ3VsYXIsICRsb2NhdGlvbikge1xuICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgUmVzdGFuZ3VsYXIuc2V0UmVxdWVzdEludGVyY2VwdG9yKGZ1bmN0aW9uKGVsZW1lbnQsIG9wZXJhdGlvbiwgcm91dGUsIHVybCkge1xuICAgIHZhciByZXF1ZXN0SGVhZGVyID0ge1xuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCJodHRwOi8vZGFuaWVsamFtZXNmb2xleS5jby51ay9cIixcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCJcbiAgICB9O1xuXG4gICAgUmVzdGFuZ3VsYXIuc2V0RGVmYXVsdEhlYWRlcnMocmVxdWVzdEhlYWRlcik7XG5cbiAgICBjb25zb2xlLmxvZygnUmVxdWVzdCcsIHtcbiAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgICBvcGVyYXRpb246IG9wZXJhdGlvbixcbiAgICAgIHJvdXRlOiByb3V0ZSxcbiAgICAgIHVybDogdXJsXG4gICAgfSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH0pO1xuXG4gIHRoYXQuZ2V0UmVzb3VyY2UgPSBmdW5jdGlvbihyZXNvdXJjZSkge1xuICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwocmVzb3VyY2UpO1xuICB9O1xuXG4gIFJlc3Rhbmd1bGFyLnNldEVycm9ySW50ZXJjZXB0b3IoXG4gICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PSA0MDEpIHtcbiAgICAgICAgdG9rZW5TZXJ2aWNlLnNldFRva2VuKCcnKTtcbiAgICAgICAgJGxvY2F0aW9uLnVybCgnL2xvZ2luJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgcmV0dXJuIHRoYXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFsnUmVzdGFuZ3VsYXInLCAnJGxvY2F0aW9uJywgQ29tbXNTZXJ2aWNlXTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2NvbW1zL3NlcnZpY2VzL0NvbW1zU2VydmljZS5qc1wiLFwiL21vZHVsZXMvY29tbXMvc2VydmljZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgY29udGFjdE1vZCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udGFjdCcsIFsndWkucm91dGVyJ10pO1xuY29udGFjdE1vZC5jb25maWcocmVxdWlyZSgnLi9yb3V0ZXMvY29udGFjdFJvdXRlcycpKTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9jb250YWN0L2luZGV4LmpzXCIsXCIvbW9kdWxlcy9jb250YWN0XCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xubW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9cm93PjxkaXYgY2xhc3M9Y29sLWxnLTEyPjxoMSBjbGFzcz1wYWdlLWhlYWRlcj5Db250YWN0IFVzPC9oMT48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPXJvdz48ZGl2IGNsYXNzPWNvbC1tZC0xMj48aDQ+RW1haWwgVXM8L2g0PjxwPjxhIGhyZWY9bWFsdGlvOmV4YW1wbGVAZXhhbXBsZS5jb20+ZXhhbXBsZUBleGFtcGxlLmNvbTwvYT48L3A+PC9kaXY+PGRpdiBjbGFzcz1jb2wtbWQtMTI+PGg0PlZpc2l0IHVzPC9oND48cD5UaGlzIGlzIHdoZXJlIHlvdSBwdXQgdGhlIGxvY2F0aW9uIGZvciB0aGUgY29tcGFueTwvcD48L2Rpdj48L2Rpdj5cIjtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2NvbnRhY3QvcGFydGlhbHMvY29udGFjdC5odG1sXCIsXCIvbW9kdWxlcy9jb250YWN0L3BhcnRpYWxzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuXG52YXIgY29udGFjdFJvdXRlcyA9IGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdjb250YWN0Jywge1xuICAgICAgdXJsOiAnL2NvbnRhY3QnLFxuICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL3BhcnRpYWxzL2NvbnRhY3QuaHRtbCcpLFxuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBbJyRzdGF0ZVByb3ZpZGVyJywgY29udGFjdFJvdXRlc107XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9jb250YWN0L3JvdXRlcy9jb250YWN0Um91dGVzLmpzXCIsXCIvbW9kdWxlcy9jb250YWN0L3JvdXRlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBtb2QgPSBhbmd1bGFyLm1vZHVsZSgnYXBwLmRhdGUnLCBbJ2FuZ3VsYXJNb21lbnQnXSk7XG5tb2QuZmFjdG9yeSgnRGF0ZVNlcnZpY2UnLCByZXF1aXJlKCcuL3NlcnZpY2VzL0RhdGVTZXJ2aWNlJykpO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2RhdGUvaW5kZXguanNcIixcIi9tb2R1bGVzL2RhdGVcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgRGF0ZVNlcnZpY2UgPSBmdW5jdGlvbihtb21lbnRTZXJ2aWNlKSB7XG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdGhhdC5tb250aE5hbWVzID0gW1xuICAgIFwiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIixcbiAgICBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXG4gIF07XG5cbiAgdGhhdC5jcmVhdGVEYXRlID0gZnVuY3Rpb24odW5peCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh1bml4KjEwMDApO1xuICB9O1xuXG4gIHRoYXQuYWRkRGF0ZUFuZFRpbWUgPSBmdW5jdGlvbihkYXRlLCB0aW1lKSB7XG4gICAgdmFyIG1vbWVudERhdGUgPSBtb21lbnQoZGF0ZSksXG4gICAgICAgIG1vbWVudFRpbWUgPSBtb21lbnQodGltZSk7XG4gICAgbW9tZW50RGF0ZS5hZGQobW9tZW50VGltZS5ob3VycygpLCAnaCcpO1xuICAgIG1vbWVudERhdGUuYWRkKG1vbWVudFRpbWUubWludXRlcygpLCAnbScpO1xuICAgIHJldHVybiBtb21lbnREYXRlO1xuICB9O1xuXG4gIHRoYXQuZ2V0VW5peCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBpZihkYXRlLnVuaXggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBkYXRlLnVuaXgoKTtcbiAgICB9XG4gICAgcmV0dXJuIG1vbWVudFNlcnZpY2UoZGF0ZSkudW5peCgpO1xuICB9O1xuXG4gIHRoYXQuZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiBNYXRoLmZsb29yKGQuZ2V0VGltZSgpIC8gMTAwMCk7XG4gIH07XG5cbiAgdGhhdC5nZXRQYXN0TW9udGhzID0gZnVuY3Rpb24obm9PZk1vbnRocykge1xuICAgIHZhciBkID0gbmV3IERhdGUoKTtcbiAgICB2YXIgY3VycmVudE1vbnRoID0gZC5nZXRNb250aCgpO1xuICAgIHZhciBjdXJyZW50WWVhciA9IGQuZ2V0WWVhcigpO1xuICAgIHZhciBkYXRlT2JqID0gbnVsbDtcbiAgICB2YXIgZGF0ZU9iakFyciA9IFtdO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG5vT2ZNb250aHM7IGkrKykge1xuICAgICAgZGF0ZU9iaiA9IGdldE1vbnRoRGF0ZVJhbmdlKGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICAgICAgZGF0ZU9iai5kaXNwbGF5ID0gdGhhdC5tb250aE5hbWVzW2N1cnJlbnRNb250aF0gKyAnICcgKyAoY3VycmVudFllYXIgKyAxOTAwKTtcblxuICAgICAgaWYoY3VycmVudE1vbnRoIC0gMSA8IDApIHtcbiAgICAgICAgY3VycmVudE1vbnRoID0gdGhhdC5tb250aE5hbWVzLmxlbmd0aCAtIDE7XG4gICAgICAgIGN1cnJlbnRZZWFyLS07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50TW9udGgtLTtcbiAgICAgIH1cbiAgICAgIGRhdGVPYmpBcnIucHVzaChkYXRlT2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGVPYmpBcnI7XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2V0TW9udGhEYXRlUmFuZ2UoeWVhciwgbW9udGgpIHtcbiAgICAvLyBtb250aCBpbiBtb21lbnQgaXMgMCBiYXNlZCwgc28gOSBpcyBhY3R1YWxseSBvY3RvYmVyLCBzdWJ0cmFjdCAxIHRvIGNvbXBlbnNhdGVcbiAgICAvLyBhcnJheSBpcyAneWVhcicsICdtb250aCcsICdkYXknLCBldGNcbiAgICB2YXIgc3RhcnREYXRlID0gbW9tZW50U2VydmljZShbeWVhciwgbW9udGhdKTtcbiAgICBzdGFydERhdGUuYWRkKDE5MDAsICd5ZWFyJyk7XG4gICAgLy8gQ2xvbmUgdGhlIHZhbHVlIGJlZm9yZSAuZW5kT2YoKVxuICAgIHZhciBlbmREYXRlID0gbW9tZW50U2VydmljZShzdGFydERhdGUpLmVuZE9mKCdtb250aCcpO1xuXG4gICAgLy8gbWFrZSBzdXJlIHRvIGNhbGwgdG9EYXRlKCkgZm9yIHBsYWluIEphdmFTY3JpcHQgZGF0ZSB0eXBlXG4gICAgcmV0dXJuIHsgc3RhcnQ6IHN0YXJ0RGF0ZS51bml4KCksIGVuZDogZW5kRGF0ZS51bml4KCkgfTtcbn1cblxuICByZXR1cm4gdGhhdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gWydtb21lbnQnLCBEYXRlU2VydmljZV07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9kYXRlL3NlcnZpY2VzL0RhdGVTZXJ2aWNlLmpzXCIsXCIvbW9kdWxlcy9kYXRlL3NlcnZpY2VzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIEV2ZW50Q29udHJvbGxlciA9IGZ1bmN0aW9uIChjYWxlbmRhclNlcnZpY2UsIGRhdGVTZXJ2aWNlKSB7XG4gIHZhciB0aGF0ID0gdGhpcztcblxuICB2YXIgY3VycmVudERhdGUgPSBkYXRlU2VydmljZS5nZXQoKTtcblxuICB0aGlzLmxpc3QgPSBjYWxlbmRhclNlcnZpY2UubGlzdCgpO1xuXG59O1xubW9kdWxlLmV4cG9ydHMgPSBbJ0NhbGVuZGFyU2VydmljZScsICdEYXRlU2VydmljZScsIEV2ZW50Q29udHJvbGxlcl07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9ldmVudC9jb250cm9sbGVycy9FdmVudENvbnRyb2xsZXIuanNcIixcIi9tb2R1bGVzL2V2ZW50L2NvbnRyb2xsZXJzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIGNhbGVuZGFyRW50cnkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vcGFydGlhbHMvY2FsZW5kYXJFbnRyeS5odG1sJyksXG4gICAgICAgIGNvbnRyb2xsZXI6ICdFdmVudENvbnRyb2xsZXInLFxuICAgICAgICBjb250cm9sbGVyQXM6ICdldmVudEN0cmwnXG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2FsZW5kYXJFbnRyeTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2V2ZW50L2RpcmVjdGl2ZXMvY2FsZW5kYXJFbnRyeS5qc1wiLFwiL21vZHVsZXMvZXZlbnQvZGlyZWN0aXZlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBldmVudE1vZCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAuZXZlbnQnLCBbJ3VpLnJvdXRlcicsICdhcHAuZGF0ZScsICdhcHAuY2FsZW5kYXInXSk7XG5ldmVudE1vZC5jb250cm9sbGVyKCdFdmVudENvbnRyb2xsZXInLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL0V2ZW50Q29udHJvbGxlcicpKTtldmVudE1vZC5kaXJlY3RpdmUoJ2NhbGVuZGFyRW50cnknLCByZXF1aXJlKCcuL2RpcmVjdGl2ZXMvY2FsZW5kYXJFbnRyeScpKTtldmVudE1vZC5mYWN0b3J5KCdFdmVudFNlcnZpY2UnLCByZXF1aXJlKCcuL3NlcnZpY2VzL0V2ZW50U2VydmljZScpKTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9ldmVudC9pbmRleC5qc1wiLFwiL21vZHVsZXMvZXZlbnRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5tb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBkYXRhLW5nLWlmPVxcXCJldmVudEN0cmwubGlzdC5sZW5ndGggPT09IDBcXFwiPk5vIHVwY29taW5nIGV2ZW50czwvZGl2PjxkaXYgZGF0YS1uZy1yZXBlYXQ9XFxcImV2ZW50IGluIGV2ZW50Q3RybC5saXN0XFxcIiBjbGFzcz1jYWxlbmRhci1lbnRyeT48ZGl2IGNsYXNzPWNhbGVuZGFyLWljb24+PGRpdiBjbGFzcz1tb250aD57e2V2ZW50LmRhdGVGcm9tICogMTAwMCB8IGRhdGU6ICdNTU0nfX08L2Rpdj48ZGl2IGNsYXNzPXllYXI+e3tldmVudC5kYXRlRnJvbSAqIDEwMDAgfCBkYXRlOiAneXl5eSd9fTwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9Y2FsZW5kYXItaW5mbz57e2V2ZW50LnRpdGxlfX08L2Rpdj48L2Rpdj5cIjtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2V2ZW50L3BhcnRpYWxzL2NhbGVuZGFyRW50cnkuaHRtbFwiLFwiL21vZHVsZXMvZXZlbnQvcGFydGlhbHNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgRXZlbnRTZXJ2aWNlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIHRoYXQubGlzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgIF1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoYXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFtFdmVudFNlcnZpY2VdO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvZXZlbnQvc2VydmljZXMvRXZlbnRTZXJ2aWNlLmpzXCIsXCIvbW9kdWxlcy9ldmVudC9zZXJ2aWNlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBIb21lQ29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGhhdCA9IHRoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFtIb21lQ29udHJvbGxlcl07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9ob21lL2NvbnRyb2xsZXJzL0hvbWVDb250cm9sbGVyLmpzXCIsXCIvbW9kdWxlcy9ob21lL2NvbnRyb2xsZXJzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIFVzZWZ1bExpbmtzQ29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgdGhhdC5saW5rcyA9IFtcbiAgICB7XG4gICAgICBuYW1lOiAnRGV2IFRvb2xzJyxcbiAgICAgIGxpbmtzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnSnNvbiBQcmV0dHknLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICBocmVmOiAnaHR0cHM6Ly9qc29uZm9ybWF0dGVyLmN1cmlvdXNjb25jZXB0LmNvbS8nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnUmVnZXgxMDEnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICBocmVmOiAnaHR0cHM6Ly9yZWdleDEwMS5jb20vJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1VuaXggdGltZXN0YW1wJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgaHJlZjogJ2h0dHBzOi8vd3d3LnVuaXh0aW1lc3RhbXAuY29tLydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ0NvcHkgMScsXG4gICAgICBsaW5rczogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0pzb24gUHJldHR5JyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgaHJlZjogJ2h0dHBzOi8vanNvbmZvcm1hdHRlci5jdXJpb3VzY29uY2VwdC5jb20vJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1JlZ2V4MTAxJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgaHJlZjogJ2h0dHBzOi8vcmVnZXgxMDEuY29tLydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdVbml4IHRpbWVzdGFtcCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgIGhyZWY6ICdodHRwczovL3d3dy51bml4dGltZXN0YW1wLmNvbS8nXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdDb3B5IDInLFxuICAgICAgbGlua3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdKc29uIFByZXR0eScsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgIGhyZWY6ICdodHRwczovL2pzb25mb3JtYXR0ZXIuY3VyaW91c2NvbmNlcHQuY29tLydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdSZWdleDEwMScsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgIGhyZWY6ICdodHRwczovL3JlZ2V4MTAxLmNvbS8nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnVW5peCB0aW1lc3RhbXAnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICBocmVmOiAnaHR0cHM6Ly93d3cudW5peHRpbWVzdGFtcC5jb20vJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdO1xuXG4gIHRoYXQuc3Vic2V0ID0gdGhhdC5saW5rc1swXS5saW5rcy5zbGljZSgwLCAzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gW1VzZWZ1bExpbmtzQ29udHJvbGxlcl07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9ob21lL2NvbnRyb2xsZXJzL1VzZWZ1bExpbmtzQ29udHJvbGxlci5qc1wiLFwiL21vZHVsZXMvaG9tZS9jb250cm9sbGVyc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBmb290ZXJMaW5rcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuLi9wYXJ0aWFscy9mb290ZXItdXNlZnVsLWxpbmtzLmh0bWwnKSxcbiAgICBjb250cm9sbGVyOiAnVXNlZnVsTGlua3NDb250cm9sbGVyJyxcbiAgICBjb250cm9sbGVyQXM6ICd1c2VmdWxMaW5rc0N0cmwnXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFtmb290ZXJMaW5rc107XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9ob21lL2RpcmVjdGl2ZXMvZ3RoRm9vdGVyTGlua3MuanNcIixcIi9tb2R1bGVzL2hvbWUvZGlyZWN0aXZlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBob21lTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5ob21lJywgWydhcHAuZGF0ZScsICd1aS5yb3V0ZXInXSk7XG5ob21lTW9kdWxlLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgcmVxdWlyZSgnLi9jb250cm9sbGVycy9Ib21lQ29udHJvbGxlcicpKTtob21lTW9kdWxlLmNvbnRyb2xsZXIoJ1VzZWZ1bExpbmtzQ29udHJvbGxlcicsIHJlcXVpcmUoJy4vY29udHJvbGxlcnMvVXNlZnVsTGlua3NDb250cm9sbGVyJykpO2hvbWVNb2R1bGUuZGlyZWN0aXZlKCdndGhGb290ZXJMaW5rcycsIHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9ndGhGb290ZXJMaW5rcycpKTtob21lTW9kdWxlLmNvbmZpZyhyZXF1aXJlKCcuL3JvdXRlcy9ob21lUm91dGVzJykpO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2hvbWUvaW5kZXguanNcIixcIi9tb2R1bGVzL2hvbWVcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5tb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1yb3c+PGRpdiBjbGFzcz1jb2wtbGctMTI+PGgxIGNsYXNzPXBhZ2UtaGVhZGVyPk1lZXQgVGhlIFRlYW08L2gxPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9cm93PjxkaXYgY2xhc3M9XFxcImNvbC1tZC03IGNvbC1zbS03IGNvbC14cy0xMlxcXCI+PGEgaHJlZj0jPjxpbWcgY2xhc3M9aW1nLXJlc3BvbnNpdmUgc3JjPS9pbWFnZXMvdGVhbS5qcGVnIGFsdD1cXFwiTWVldCBvdXIgdGVhbVxcXCI+PC9hPjwvZGl2PjxkaXYgY2xhc3M9XFxcImNvbC1tZC01IGNvbC1zbS01IGNvbC14cy0xMlxcXCI+PGgzPkFib3V0IFVzPC9oMz48cD5Db250cmFyeSB0byBwb3B1bGFyIGJlbGllZiwgTG9yZW0gSXBzdW0gaXMgbm90IHNpbXBseSByYW5kb20gdGV4dC4gSXQgaGFzIHJvb3RzIGluIGEgcGllY2Ugb2YgY2xhc3NpY2FsIExhdGluIGxpdGVyYXR1cmUgZnJvbSA0NSBCQywgbWFraW5nIGl0IG92ZXIgMjAwMCB5ZWFycyBvbGQuIFJpY2hhcmQgTWNDbGludG9jaywgYSBMYXRpbiBwcm9mZXNzb3IgYXQgSGFtcGRlbi1TeWRuZXkgQ29sbGVnZSBpbiBWaXJnaW5pYSwgbG9va2VkIHVwIG9uZSBvZiB0aGUgbW9yZSBvYnNjdXJlIExhdGluIHdvcmRzLCBjb25zZWN0ZXR1ciwgZnJvbSBhIExvcmVtIElwc3VtIHBhc3NhZ2UsIGFuZCBnb2luZyB0aHJvdWdoIHRoZSBjaXRlcyBvZiB0aGUgd29yZCBpbiBjbGFzc2ljYWwgbGl0ZXJhdHVyZSwgZGlzY292ZXJlZCB0aGUgdW5kb3VidGFibGUgc291cmNlLiBMb3JlbSBJcHN1bSBjb21lcyBmcm9tIHNlY3Rpb25zIDEuMTAuMzIgYW5kIDEuMTAuMzMgb2YgXFxcImRlIEZpbmlidXMgQm9ub3J1bSBldCBNYWxvcnVtXFxcIiAoVGhlIEV4dHJlbWVzIG9mIEdvb2QgYW5kIEV2aWwpIGJ5IENpY2Vybywgd3JpdHRlbiBpbiA0NSBCQy4gVGhpcyBib29rIGlzIGEgdHJlYXRpc2Ugb24gdGhlIHRoZW9yeSBvZiBldGhpY3MsIHZlcnkgcG9wdWxhciBkdXJpbmcgdGhlIFJlbmFpc3NhbmNlLiBUaGUgZmlyc3QgbGluZSBvZiBMb3JlbSBJcHN1bSwgXFxcIkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0Li5cXFwiLCBjb21lcyBmcm9tIGEgbGluZSBpbiBzZWN0aW9uIDEuMTAuMzIuPC9wPjwvZGl2PjwvZGl2Pjxocj5cIjtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2hvbWUvcGFydGlhbHMvYWJvdXQuaHRtbFwiLFwiL21vZHVsZXMvaG9tZS9wYXJ0aWFsc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbm1vZHVsZS5leHBvcnRzID0gXCI8cD5IZXJlIGFyZSBzb21lIHVzZWZ1bCBsaW5rcyB3b3VsZCB5b3UgbWlnaHQgYmUgaW50ZXJlc3RlZCBpbjx1bCBjbGFzcz1mb290ZXItdXNlZnVsLWxpbmtzPjxsaSBuZy1yZXBlYXQ9XFxcImxpbmsgaW4gdXNlZnVsTGlua3NDdHJsLnN1YnNldFxcXCI+PGEgbmctaHJlZj17e2xpbmsuaHJlZn19IHRhcmdldD1fYmxhbms+e3tsaW5rLm5hbWV9fTwvYT48L2xpPjwvdWw+PC9wPlwiO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvaG9tZS9wYXJ0aWFscy9mb290ZXItdXNlZnVsLWxpbmtzLmh0bWxcIixcIi9tb2R1bGVzL2hvbWUvcGFydGlhbHNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5tb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1wYWdlLXRpdGxlPjxoMj5EZW1vIGFwcGxpY2F0aW9uPC9oMj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJyb3cgc3BhY2luZ1xcXCI+PGRpdiBjbGFzcz1jb2wtbWQtMTI+XFxcIkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaXRhdGlvbiB1bGxhbWNvIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGUgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci4gRXhjZXB0ZXVyIHNpbnQgb2NjYWVjYXQgY3VwaWRhdGF0IG5vbiBwcm9pZGVudCwgc3VudCBpbiBjdWxwYSBxdWkgb2ZmaWNpYSBkZXNlcnVudCBtb2xsaXQgYW5pbSBpZCBlc3QgbGFib3J1bS5cXFwiPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwicm93IHNwYWNpbmdcXFwiPjxkaXYgY2xhc3M9XFxcImhpZGRlbi14cyBjb2wtbWQtM1xcXCI+PGRpdiBjbGFzcz1zZWN0aW9uLXRpdGxlPjxoND5DYWxlbmRhcjwvaDQ+PC9kaXY+PGNhbGVuZGFyLWVudHJ5PjwvY2FsZW5kYXItZW50cnk+PC9kaXY+PGRpdiBjbGFzcz1cXFwiY29sLW1kLTYgY29sLXhzLTEyXFxcIj4xOTE0IHRyYW5zbGF0aW9uIGJ5IEguIFJhY2toYW0gXFxcIkJ1dCBJIG11c3QgZXhwbGFpbiB0byB5b3UgaG93IGFsbCB0aGlzIG1pc3Rha2VuIGlkZWEgb2YgZGVub3VuY2luZyBwbGVhc3VyZSBhbmQgcHJhaXNpbmcgcGFpbiB3YXMgYm9ybiBhbmQgSSB3aWxsIGdpdmUgeW91IGEgY29tcGxldGUgYWNjb3VudCBvZiB0aGUgc3lzdGVtLCBhbmQgZXhwb3VuZCB0aGUgYWN0dWFsIHRlYWNoaW5ncyBvZiB0aGUgZ3JlYXQgZXhwbG9yZXIgb2YgdGhlIHRydXRoLCB0aGUgbWFzdGVyLWJ1aWxkZXIgb2YgaHVtYW4gaGFwcGluZXNzLiBObyBvbmUgcmVqZWN0cywgZGlzbGlrZXMsIG9yIGF2b2lkcyBwbGVhc3VyZSBpdHNlbGYsIGJlY2F1c2UgaXQgaXMgcGxlYXN1cmUsIGJ1dCBiZWNhdXNlIHRob3NlIHdobyBkbyBub3Qga25vdyBob3cgdG8gcHVyc3VlIHBsZWFzdXJlIHJhdGlvbmFsbHkgZW5jb3VudGVyIGNvbnNlcXVlbmNlcyB0aGF0IGFyZSBleHRyZW1lbHkgcGFpbmZ1bC4gTm9yIGFnYWluIGlzIHRoZXJlIGFueW9uZSB3aG8gbG92ZXMgb3IgcHVyc3VlcyBvciBkZXNpcmVzIHRvIG9idGFpbiBwYWluIG9mIGl0c2VsZiwgYmVjYXVzZSBpdCBpcyBwYWluLCBidXQgYmVjYXVzZSBvY2Nhc2lvbmFsbHkgY2lyY3Vtc3RhbmNlcyBvY2N1ciBpbiB3aGljaCB0b2lsIGFuZCBwYWluIGNhbiBwcm9jdXJlIGhpbSBzb21lIGdyZWF0IHBsZWFzdXJlLiBUbyB0YWtlIGEgdHJpdmlhbCBleGFtcGxlLCB3aGljaCBvZiB1cyBldmVyIHVuZGVydGFrZXMgbGFib3Jpb3VzIHBoeXNpY2FsIGV4ZXJjaXNlLCBleGNlcHQgdG8gb2J0YWluIHNvbWUgYWR2YW50YWdlIGZyb20gaXQ/IEJ1dCB3aG8gaGFzIGFueSByaWdodCB0byBmaW5kIGZhdWx0IHdpdGggYSBtYW4gd2hvIGNob29zZXMgdG8gZW5qb3kgYSBwbGVhc3VyZSB0aGF0IGhhcyBubyBhbm5veWluZyBjb25zZXF1ZW5jZXMsIG9yIG9uZSB3aG8gYXZvaWRzIGEgcGFpbiB0aGF0IHByb2R1Y2VzIG5vIHJlc3VsdGFudCBwbGVhc3VyZT9cXFwiPGJyPjxicj5TZWN0aW9uIDEuMTAuMzMgb2YgXFxcImRlIEZpbmlidXMgQm9ub3J1bSBldCBNYWxvcnVtXFxcIiwgd3JpdHRlbiBieSBDaWNlcm8gaW4gNDUgQkMgXFxcIkF0IHZlcm8gZW9zIGV0IGFjY3VzYW11cyBldCBpdXN0byBvZGlvIGRpZ25pc3NpbW9zIGR1Y2ltdXMgcXVpIGJsYW5kaXRpaXMgcHJhZXNlbnRpdW0gdm9sdXB0YXR1bSBkZWxlbml0aSBhdHF1ZSBjb3JydXB0aSBxdW9zIGRvbG9yZXMgZXQgcXVhcyBtb2xlc3RpYXMgZXhjZXB0dXJpIHNpbnQgb2NjYWVjYXRpIGN1cGlkaXRhdGUgbm9uIHByb3ZpZGVudCwgc2ltaWxpcXVlIHN1bnQgaW4gY3VscGEgcXVpIG9mZmljaWEgZGVzZXJ1bnQgbW9sbGl0aWEgYW5pbWksIGlkIGVzdCBsYWJvcnVtIGV0IGRvbG9ydW0gZnVnYS4gRXQgaGFydW0gcXVpZGVtIHJlcnVtIGZhY2lsaXMgZXN0IGV0IGV4cGVkaXRhIGRpc3RpbmN0aW8uIE5hbSBsaWJlcm8gdGVtcG9yZSwgY3VtIHNvbHV0YSBub2JpcyBlc3QgZWxpZ2VuZGkgb3B0aW8gY3VtcXVlIG5paGlsIGltcGVkaXQgcXVvIG1pbnVzIGlkIHF1b2QgbWF4aW1lIHBsYWNlYXQgZmFjZXJlIHBvc3NpbXVzLCBvbW5pcyB2b2x1cHRhcyBhc3N1bWVuZGEgZXN0LCBvbW5pcyBkb2xvciByZXBlbGxlbmR1cy4gVGVtcG9yaWJ1cyBhdXRlbSBxdWlidXNkYW0gZXQgYXV0IG9mZmljaWlzIGRlYml0aXMgYXV0IHJlcnVtIG5lY2Vzc2l0YXRpYnVzIHNhZXBlIGV2ZW5pZXQgdXQgZXQgdm9sdXB0YXRlcyByZXB1ZGlhbmRhZSBzaW50IGV0IG1vbGVzdGlhZSBub24gcmVjdXNhbmRhZS4gSXRhcXVlIGVhcnVtIHJlcnVtIGhpYyB0ZW5ldHVyIGEgc2FwaWVudGUgZGVsZWN0dXMsIHV0IGF1dCByZWljaWVuZGlzIHZvbHVwdGF0aWJ1cyBtYWlvcmVzIGFsaWFzIGNvbnNlcXVhdHVyIGF1dCBwZXJmZXJlbmRpcyBkb2xvcmlidXMgYXNwZXJpb3JlcyByZXBlbGxhdC5cXFwiPGJyPjxicj4xOTE0IHRyYW5zbGF0aW9uIGJ5IEguIFJhY2toYW0gXFxcIk9uIHRoZSBvdGhlciBoYW5kLCB3ZSBkZW5vdW5jZSB3aXRoIHJpZ2h0ZW91cyBpbmRpZ25hdGlvbiBhbmQgZGlzbGlrZSBtZW4gd2hvIGFyZSBzbyBiZWd1aWxlZCBhbmQgZGVtb3JhbGl6ZWQgYnkgdGhlIGNoYXJtcyBvZiBwbGVhc3VyZSBvZiB0aGUgbW9tZW50LCBzbyBibGluZGVkIGJ5IGRlc2lyZSwgdGhhdCB0aGV5IGNhbm5vdCBmb3Jlc2VlIHRoZSBwYWluIGFuZCB0cm91YmxlIHRoYXQgYXJlIGJvdW5kIHRvIGVuc3VlOyBhbmQgZXF1YWwgYmxhbWUgYmVsb25ncyB0byB0aG9zZSB3aG8gZmFpbCBpbiB0aGVpciBkdXR5IHRocm91Z2ggd2Vha25lc3Mgb2Ygd2lsbCwgd2hpY2ggaXMgdGhlIHNhbWUgYXMgc2F5aW5nIHRocm91Z2ggc2hyaW5raW5nIGZyb20gdG9pbCBhbmQgcGFpbi4gVGhlc2UgY2FzZXMgYXJlIHBlcmZlY3RseSBzaW1wbGUgYW5kIGVhc3kgdG8gZGlzdGluZ3Vpc2guIEluIGEgZnJlZSBob3VyLCB3aGVuIG91ciBwb3dlciBvZiBjaG9pY2UgaXMgdW50cmFtbWVsbGVkIGFuZCB3aGVuIG5vdGhpbmcgcHJldmVudHMgb3VyIGJlaW5nIGFibGUgdG8gZG8gd2hhdCB3ZSBsaWtlIGJlc3QsIGV2ZXJ5IHBsZWFzdXJlIGlzIHRvIGJlIHdlbGNvbWVkIGFuZCBldmVyeSBwYWluIGF2b2lkZWQuIEJ1dCBpbiBjZXJ0YWluIGNpcmN1bXN0YW5jZXMgYW5kIG93aW5nIHRvIHRoZSBjbGFpbXMgb2YgZHV0eSBvciB0aGUgb2JsaWdhdGlvbnMgb2YgYnVzaW5lc3MgaXQgd2lsbCBmcmVxdWVudGx5IG9jY3VyIHRoYXQgcGxlYXN1cmVzIGhhdmUgdG8gYmUgcmVwdWRpYXRlZCBhbmQgYW5ub3lhbmNlcyBhY2NlcHRlZC4gVGhlIHdpc2UgbWFuIHRoZXJlZm9yZSBhbHdheXMgaG9sZHMgaW4gdGhlc2UgbWF0dGVycyB0byB0aGlzIHByaW5jaXBsZSBvZiBzZWxlY3Rpb246IGhlIHJlamVjdHMgcGxlYXN1cmVzIHRvIHNlY3VyZSBvdGhlciBncmVhdGVyIHBsZWFzdXJlcywgb3IgZWxzZSBoZSBlbmR1cmVzIHBhaW5zIHRvIGF2b2lkIHdvcnNlIHBhaW5zLlxcXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJoaWRkZW4teHMgY29sLW1kLTNcXFwiPjxkaXYgY2xhc3M9c2VjdGlvbi10aXRsZT48aDQ+Q29ubmVjdCB3aXRoIHVzPC9oND48L2Rpdj5Db25uZWN0IHdpdGggdXMgdXNpbmcgdGhlIGZvbGxvd2luZyBpbmZvcm1hdGlvbjwvZGl2PjwvZGl2PlwiO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvaG9tZS9wYXJ0aWFscy9ob21lLmh0bWxcIixcIi9tb2R1bGVzL2hvbWUvcGFydGlhbHNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5tb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1yb3c+PGRpdiBjbGFzcz1jb2wtbGctMTI+PGgxIGNsYXNzPXBhZ2UtaGVhZGVyPlVzZWZ1bCBMaW5rczwvaDE+PHA+PC9wPjwvZGl2PjxkaXYgY2xhc3M9XFxcImNvbC1tZC00IHVzZWZ1bC1saW5rcyBib3JkZXItbGVmdFxcXCIgbmctcmVwZWF0PVxcXCJzZWN0aW9uIGluIHVzZWZ1bExpbmtzQ3RybC5saW5rc1xcXCIgbmctY2xhc3M9XFxcIiRpbmRleCA+PSAzID8gICdzZWN0aW9uLW1hcmdpbi1wYWRkaW5nJyA6ICcnIFxcXCI+PGgzPnt7c2VjdGlvbi5uYW1lfX08L2gzPjx1bD48bGkgbmctcmVwZWF0PVxcXCJsaW5rIGluIHNlY3Rpb24ubGlua3NcXFwiPjxhIG5nLWhyZWY9e3tsaW5rLmhyZWZ9fSB0YXJnZXQ9X2JsYW5rPnt7bGluay5uYW1lfX08L2E+IDxzcGFuIG5nLXNob3c9XFxcImxpbmsuZGVzY3JpcHRpb24ubGVuZ3RoID4gMFxcXCIgY2xhc3M9dXNlZnVsLWxpbmstZGVzY3JpcHRpb24+LSB7e2xpbmsuZGVzY3JpcHRpb259fTwvc3Bhbj48L2xpPjwvdWw+PC9kaXY+PC9kaXY+XCI7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9ob21lL3BhcnRpYWxzL2xpbmtzLmh0bWxcIixcIi9tb2R1bGVzL2hvbWUvcGFydGlhbHNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5tb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1yb3c+PGRpdiBjbGFzcz1jb2wtbGctMTI+PGgxIGNsYXNzPXBhZ2UtaGVhZGVyPk91ciBzcG9uc29yczwvaDE+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1yb3c+PGRpdiBjbGFzcz1cXFwiY29sLW1kLTMgY29sLXNtLTcgY29sLXhzLTEyXFxcIj48YSBocmVmPWh0dHA6Ly9mYWNlYm9vay5jby51ay8gdGl0bGU9IyB0YXJnZXQ9X2JsYW5rPjxpbWcgc3JjPWltYWdlcy9mYWNlYm9va2xvZ28ucG5nIGNsYXNzPXNwb25zb3IgYWx0PSM+PC9hPjwvZGl2PjxkaXYgY2xhc3M9XFxcImNvbC1tZC05IGNvbC1zbS01IGNvbC14cy0xMlxcXCI+PGgzPjxhIGhyZWY9aHR0cDovL2hhdGh3YXlzLmNvLnVrLyA+RmFjZWJvb2s8L2E+PC9oMz48aDQ+RmFjZWJvb2s8L2g0PjxwPlxcXCJCdXQgSSBtdXN0IGV4cGxhaW4gdG8geW91IGhvdyBhbGwgdGhpcyBtaXN0YWtlbiBpZGVhIG9mIGRlbm91bmNpbmcgcGxlYXN1cmUgYW5kIHByYWlzaW5nIHBhaW4gd2FzIGJvcm4gYW5kIEkgd2lsbCBnaXZlIHlvdSBhIGNvbXBsZXRlIGFjY291bnQgb2YgdGhlIHN5c3RlbSwgYW5kIGV4cG91bmQgdGhlIGFjdHVhbCB0ZWFjaGluZ3Mgb2YgdGhlIGdyZWF0IGV4cGxvcmVyIG9mIHRoZSB0cnV0aCwgdGhlIG1hc3Rlci1idWlsZGVyIG9mIGh1bWFuIGhhcHBpbmVzcy4gTm8gb25lIHJlamVjdHMsIGRpc2xpa2VzLCBvciBhdm9pZHMgcGxlYXN1cmUgaXRzZWxmLCBiZWNhdXNlIGl0IGlzIHBsZWFzdXJlLCBidXQgYmVjYXVzZSB0aG9zZSB3aG8gZG8gbm90IGtub3cgaG93IHRvIHB1cnN1ZSBwbGVhc3VyZSByYXRpb25hbGx5IGVuY291bnRlciBjb25zZXF1ZW5jZXMgdGhhdCBhcmUgZXh0cmVtZWx5IHBhaW5mdWwuIE5vciBhZ2FpbiBpcyB0aGVyZSBhbnlvbmUgd2hvIGxvdmVzIG9yIHB1cnN1ZXMgb3IgZGVzaXJlcyB0byBvYnRhaW4gcGFpbiBvZiBpdHNlbGYsIGJlY2F1c2UgaXQgaXMgcGFpbiwgYnV0IGJlY2F1c2Ugb2NjYXNpb25hbGx5IGNpcmN1bXN0YW5jZXMgb2NjdXIgaW4gd2hpY2ggdG9pbCBhbmQgcGFpbiBjYW4gcHJvY3VyZSBoaW0gc29tZSBncmVhdCBwbGVhc3VyZS4gVG8gdGFrZSBhIHRyaXZpYWwgZXhhbXBsZSwgd2hpY2ggb2YgdXMgZXZlciB1bmRlcnRha2VzIGxhYm9yaW91cyBwaHlzaWNhbCBleGVyY2lzZSwgZXhjZXB0IHRvIG9idGFpbiBzb21lIGFkdmFudGFnZSBmcm9tIGl0PyBCdXQgd2hvIGhhcyBhbnkgcmlnaHQgdG8gZmluZCBmYXVsdCB3aXRoIGEgbWFuIHdobyBjaG9vc2VzIHRvIGVuam95IGEgcGxlYXN1cmUgdGhhdCBoYXMgbm8gYW5ub3lpbmcgY29uc2VxdWVuY2VzLCBvciBvbmUgd2hvIGF2b2lkcyBhIHBhaW4gdGhhdCBwcm9kdWNlcyBubyByZXN1bHRhbnQgcGxlYXN1cmU/XFxcIjwvcD48L2Rpdj48L2Rpdj48aHI+PGRpdiBjbGFzcz1yb3c+PGRpdiBjbGFzcz1cXFwiY29sLW1kLTMgY29sLXNtLTcgY29sLXhzLTEyXFxcIj48YSBocmVmPWh0dHBzOi8vdHdpdHRlci5jby51ayB0aXRsZT0jIHRhcmdldD1fYmxhbms+PGltZyBzcmM9aW1hZ2VzL3R3aXR0ZXJsb2dvLnBuZyBjbGFzcz1zcG9uc29yIGFsdD0jPjwvYT48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjb2wtbWQtOSBjb2wtc20tNSBjb2wteHMtMTJcXFwiPjxoMz48YSBocmVmPVxcXCJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS8xMTI2Nzg5MzIwMTgyOTcyODA4OTIvYWJvdXQ/Z2w9dWsmaGw9ZW5cXFwiPlR3aXR0ZXI8L2E+PC9oMz48aDQ+VHdpdHRlcjwvaDQ+PHA+XFxcIkF0IHZlcm8gZW9zIGV0IGFjY3VzYW11cyBldCBpdXN0byBvZGlvIGRpZ25pc3NpbW9zIGR1Y2ltdXMgcXVpIGJsYW5kaXRpaXMgcHJhZXNlbnRpdW0gdm9sdXB0YXR1bSBkZWxlbml0aSBhdHF1ZSBjb3JydXB0aSBxdW9zIGRvbG9yZXMgZXQgcXVhcyBtb2xlc3RpYXMgZXhjZXB0dXJpIHNpbnQgb2NjYWVjYXRpIGN1cGlkaXRhdGUgbm9uIHByb3ZpZGVudCwgc2ltaWxpcXVlIHN1bnQgaW4gY3VscGEgcXVpIG9mZmljaWEgZGVzZXJ1bnQgbW9sbGl0aWEgYW5pbWksIGlkIGVzdCBsYWJvcnVtIGV0IGRvbG9ydW0gZnVnYS4gRXQgaGFydW0gcXVpZGVtIHJlcnVtIGZhY2lsaXMgZXN0IGV0IGV4cGVkaXRhIGRpc3RpbmN0aW8uIE5hbSBsaWJlcm8gdGVtcG9yZSwgY3VtIHNvbHV0YSBub2JpcyBlc3QgZWxpZ2VuZGkgb3B0aW8gY3VtcXVlIG5paGlsIGltcGVkaXQgcXVvIG1pbnVzIGlkIHF1b2QgbWF4aW1lIHBsYWNlYXQgZmFjZXJlIHBvc3NpbXVzLCBvbW5pcyB2b2x1cHRhcyBhc3N1bWVuZGEgZXN0LCBvbW5pcyBkb2xvciByZXBlbGxlbmR1cy4gVGVtcG9yaWJ1cyBhdXRlbSBxdWlidXNkYW0gZXQgYXV0IG9mZmljaWlzIGRlYml0aXMgYXV0IHJlcnVtIG5lY2Vzc2l0YXRpYnVzIHNhZXBlIGV2ZW5pZXQgdXQgZXQgdm9sdXB0YXRlcyByZXB1ZGlhbmRhZSBzaW50IGV0IG1vbGVzdGlhZSBub24gcmVjdXNhbmRhZS4gSXRhcXVlIGVhcnVtIHJlcnVtIGhpYyB0ZW5ldHVyIGEgc2FwaWVudGUgZGVsZWN0dXMsIHV0IGF1dCByZWljaWVuZGlzIHZvbHVwdGF0aWJ1cyBtYWlvcmVzIGFsaWFzIGNvbnNlcXVhdHVyIGF1dCBwZXJmZXJlbmRpcyBkb2xvcmlidXMgYXNwZXJpb3JlcyByZXBlbGxhdC5cXFwiPC9wPjwvZGl2PjwvZGl2Pjxocj48ZGl2IGNsYXNzPXJvdz48ZGl2IGNsYXNzPVxcXCJjb2wtbWQtMyBjb2wtc20tNyBjb2wteHMtMTJcXFwiPjxhIGhyZWY9aHR0cDovL2dvb2dsZS5jby51ay8gdGl0bGU9IyB0YXJnZXQ9X2JsYW5rPjxpbWcgc3JjPWltYWdlcy9nb29nbGVsb2dvLmpwZyBjbGFzcz1zcG9uc29yIGFsdD0jPjwvYT48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjb2wtbWQtOSBjb2wtc20tNSBjb2wteHMtMTJcXFwiPjxoMz48YSBocmVmPWh0dHA6Ly92aXJnb2NhcmVob21lcy5jb20vID5Hb29nbGU8L2E+PC9oMz48aDQ+R29vZ2xlPC9oND48cD5cXFwiT24gdGhlIG90aGVyIGhhbmQsIHdlIGRlbm91bmNlIHdpdGggcmlnaHRlb3VzIGluZGlnbmF0aW9uIGFuZCBkaXNsaWtlIG1lbiB3aG8gYXJlIHNvIGJlZ3VpbGVkIGFuZCBkZW1vcmFsaXplZCBieSB0aGUgY2hhcm1zIG9mIHBsZWFzdXJlIG9mIHRoZSBtb21lbnQsIHNvIGJsaW5kZWQgYnkgZGVzaXJlLCB0aGF0IHRoZXkgY2Fubm90IGZvcmVzZWUgdGhlIHBhaW4gYW5kIHRyb3VibGUgdGhhdCBhcmUgYm91bmQgdG8gZW5zdWU7IGFuZCBlcXVhbCBibGFtZSBiZWxvbmdzIHRvIHRob3NlIHdobyBmYWlsIGluIHRoZWlyIGR1dHkgdGhyb3VnaCB3ZWFrbmVzcyBvZiB3aWxsLCB3aGljaCBpcyB0aGUgc2FtZSBhcyBzYXlpbmcgdGhyb3VnaCBzaHJpbmtpbmcgZnJvbSB0b2lsIGFuZCBwYWluLiBUaGVzZSBjYXNlcyBhcmUgcGVyZmVjdGx5IHNpbXBsZSBhbmQgZWFzeSB0byBkaXN0aW5ndWlzaC4gSW4gYSBmcmVlIGhvdXIsIHdoZW4gb3VyIHBvd2VyIG9mIGNob2ljZSBpcyB1bnRyYW1tZWxsZWQgYW5kIHdoZW4gbm90aGluZyBwcmV2ZW50cyBvdXIgYmVpbmcgYWJsZSB0byBkbyB3aGF0IHdlIGxpa2UgYmVzdCwgZXZlcnkgcGxlYXN1cmUgaXMgdG8gYmUgd2VsY29tZWQgYW5kIGV2ZXJ5IHBhaW4gYXZvaWRlZC4gQnV0IGluIGNlcnRhaW4gY2lyY3Vtc3RhbmNlcyBhbmQgb3dpbmcgdG8gdGhlIGNsYWltcyBvZiBkdXR5IG9yIHRoZSBvYmxpZ2F0aW9ucyBvZiBidXNpbmVzcyBpdCB3aWxsIGZyZXF1ZW50bHkgb2NjdXIgdGhhdCBwbGVhc3VyZXMgaGF2ZSB0byBiZSByZXB1ZGlhdGVkIGFuZCBhbm5veWFuY2VzIGFjY2VwdGVkLiBUaGUgd2lzZSBtYW4gdGhlcmVmb3JlIGFsd2F5cyBob2xkcyBpbiB0aGVzZSBtYXR0ZXJzIHRvIHRoaXMgcHJpbmNpcGxlIG9mIHNlbGVjdGlvbjogaGUgcmVqZWN0cyBwbGVhc3VyZXMgdG8gc2VjdXJlIG90aGVyIGdyZWF0ZXIgcGxlYXN1cmVzLCBvciBlbHNlIGhlIGVuZHVyZXMgcGFpbnMgdG8gYXZvaWQgd29yc2UgcGFpbnMuXFxcIjwvcD48L2Rpdj48L2Rpdj5cIjtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2hvbWUvcGFydGlhbHMvc3BvbnNvcnMuaHRtbFwiLFwiL21vZHVsZXMvaG9tZS9wYXJ0aWFsc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcblxudmFyIGhvbWVSb3V0ZXMgPSBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAuc3RhdGUoJ2hvbWUnLCB7XG4gICAgdXJsOiAnLycsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL3BhcnRpYWxzL2hvbWUuaHRtbCcpLFxuICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcicsXG4gICAgY29udHJvbGxlckFzOiAnaG9tZUN0cmwnXG4gIH0pXG4gIC5zdGF0ZSgnYWJvdXQnLCB7XG4gICAgdXJsOiAnL2Fib3V0JyxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vcGFydGlhbHMvYWJvdXQuaHRtbCcpXG4gIH0pXG4gIC5zdGF0ZSgnc3BvbnNvcnMnLCB7XG4gICAgdXJsOiAnL3Nwb25zb3JzJyxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vcGFydGlhbHMvc3BvbnNvcnMuaHRtbCcpXG4gIH0pXG4gIC5zdGF0ZSgnbGlua3MnLCB7XG4gICAgdXJsOiAnL3VzZWZ1bC1saW5rcycsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL3BhcnRpYWxzL2xpbmtzLmh0bWwnKSxcbiAgICBjb250cm9sbGVyOiAnVXNlZnVsTGlua3NDb250cm9sbGVyJyxcbiAgICBjb250cm9sbGVyQXM6ICd1c2VmdWxMaW5rc0N0cmwnXG4gIH0pO1xuXG5cbiAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCBob21lUm91dGVzXTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL2hvbWUvcm91dGVzL2hvbWVSb3V0ZXMuanNcIixcIi9tb2R1bGVzL2hvbWUvcm91dGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIE5ld3NBcnRpY2xlQ29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFtOZXdzQXJ0aWNsZUNvbnRyb2xsZXJdO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvbmV3cy9jb250cm9sbGVycy9OZXdzQXJ0aWNsZUNvbnRyb2xsZXIuanNcIixcIi9tb2R1bGVzL25ld3MvY29udHJvbGxlcnNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgTmV3c0ZlZWRDb250cm9sbGVyID0gZnVuY3Rpb24obGlzdCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5tZXRhID0ge1xuICAgIHRvdGFsQ291bnQ6IGxpc3QubGVuZ3RoLFxuICAgIHBhZ2VJbmRleDogMSxcbiAgICBtYXhQZXJQYWdlOiAyLFxuICAgIG5vT2ZQYWdlczogMTAsXG4gICAgbWF4UGVyUGFnZU9wdHM6IFsxLCAyLCAzLCA0LCA1XVxuICB9O1xuXG4gIHNlbGYucGFnZUNoYW5nZWQgPSBmdW5jdGlvbigpIHt9O1xuXG4gIHNlbGYuc2V0TWF4UGVyUGFnZSA9IGZ1bmN0aW9uKG9wdCkge1xuICAgIHNlbGYubWV0YS5tYXhQZXJQYWdlID0gb3B0O1xuICB9XG5cbiAgc2VsZi5saXN0ID0gbGlzdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gWydsaXN0JywgTmV3c0ZlZWRDb250cm9sbGVyXTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL25ld3MvY29udHJvbGxlcnMvTmV3c0ZlZWRDb250cm9sbGVyLmpzXCIsXCIvbW9kdWxlcy9uZXdzL2NvbnRyb2xsZXJzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIE5ld3NQYWdlQ29udHJvbGxlciA9IGZ1bmN0aW9uKGFydGljbGUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLmFydGljbGUgPSBhcnRpY2xlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBbJ2FydGljbGUnLCBOZXdzUGFnZUNvbnRyb2xsZXJdO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvbmV3cy9jb250cm9sbGVycy9OZXdzUGFnZUNvbnRyb2xsZXIuanNcIixcIi9tb2R1bGVzL25ld3MvY29udHJvbGxlcnNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbmV3c0FydGljbGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vcGFydGlhbHMvbmV3c0FydGljbGUuaHRtbCcpLFxuICAgICAgICBjb250cm9sbGVyOiAnTmV3c0FydGljbGVDb250cm9sbGVyJyxcbiAgICAgICAgY29udHJvbGxlckFzOiAnbmV3c0FydGljbGVDdHJsJyxcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIGFydGljbGU6ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICAgICAgICBjdHJsLmFydGljbGUgPSBzY29wZS5hcnRpY2xlO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gW25ld3NBcnRpY2xlXTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9uZXdzL2RpcmVjdGl2ZXMvbmV3c0FydGljbGUuanNcIixcIi9tb2R1bGVzL25ld3MvZGlyZWN0aXZlc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBuZXdzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5uZXdzJywgWyd1aS5yb3V0ZXInLCAndWkuYm9vdHN0cmFwJ10pO1xubmV3c01vZHVsZS5jb250cm9sbGVyKCdOZXdzQXJ0aWNsZUNvbnRyb2xsZXInLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL05ld3NBcnRpY2xlQ29udHJvbGxlcicpKTtuZXdzTW9kdWxlLmNvbnRyb2xsZXIoJ05ld3NGZWVkQ29udHJvbGxlcicsIHJlcXVpcmUoJy4vY29udHJvbGxlcnMvTmV3c0ZlZWRDb250cm9sbGVyJykpO25ld3NNb2R1bGUuY29udHJvbGxlcignTmV3c1BhZ2VDb250cm9sbGVyJywgcmVxdWlyZSgnLi9jb250cm9sbGVycy9OZXdzUGFnZUNvbnRyb2xsZXInKSk7bmV3c01vZHVsZS5kaXJlY3RpdmUoJ25ld3NBcnRpY2xlJywgcmVxdWlyZSgnLi9kaXJlY3RpdmVzL25ld3NBcnRpY2xlJykpO25ld3NNb2R1bGUuZmFjdG9yeSgnTmV3c1NlcnZpY2UnLCByZXF1aXJlKCcuL3NlcnZpY2VzL05ld3NTZXJ2aWNlJykpO25ld3NNb2R1bGUuY29uZmlnKHJlcXVpcmUoJy4vcm91dGVzL25ld3NSb3V0ZXMnKSk7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXMvbmV3cy9pbmRleC5qc1wiLFwiL21vZHVsZXMvbmV3c1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbm1vZHVsZS5leHBvcnRzID0gXCI8aDE+PGEgdWktc3JlZj1cXFwibmV3c0FydGljbGUoe2lkOiBhcnRpY2xlLmlkfSlcXFwiPnt7YXJ0aWNsZS50aXRsZX19PC9hPjwvaDE+PHAgY2xhc3M9bGVhZD5CeSBBZG1pbmlzdHJhdG9yPC9wPjxocj48cD48c3BhbiBjbGFzcz1cXFwiZ2x5cGhpY29uIGdseXBoaWNvbi10aW1lXFxcIj48L3NwYW4+IFBvc3RlZCBvbiB7e2FydGljbGUuY3JlYXRlZH19PC9wPjxocj48aW1nIGNsYXNzPWltZy1yZXNwb25zaXZlIG5nLXNyYz0vaW1hZ2VzL2V4YW1wbGUtaW1hZ2UuanBnIGFsdD1cXFwiXFxcIj48aHI+PHAgY2xhc3M9bGVhZD57e2FydGljbGUuaGVhZGluZ319PC9wPjxwIHN0eWxlPVxcXCJ3aGl0ZS1zcGFjZTogcHJlLWxpbmVcXFwiPnt7YXJ0aWNsZS5ib2R5fX08L3A+XCI7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9uZXdzL3BhcnRpYWxzL25ld3NBcnRpY2xlLmh0bWxcIixcIi9tb2R1bGVzL25ld3MvcGFydGlhbHNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5tb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1yb3c+PGRpdiBjbGFzcz1jb2wtbGctOD48ZGl2IGNsYXNzPXJvdyBkYXRhLW5nLXJlcGVhdD1cXFwibmV3cyBpbiBuZXdzRmVlZEN0cmwubGlzdFxcXCI+PGRpdiBjbGFzcz1jb2wtbWQtMTI+PG5ld3MtYXJ0aWNsZSBhcnRpY2xlPW5ld3M+PC9uZXdzLWFydGljbGU+PGhyPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9cm93IG5nLXNob3c9XFxcIm5ld3NGZWVkQ3RybC5saXN0Lmxlbmd0aCA9PSAwXFxcIj48aDM+Tm8gbmV3cyBhcnRpY2xlcyBhdmFpbGFibGUgaW4gdGhpcyBjYXRlZ29yeSwgcGxlYXNlIGNsZWFyIHlvdXIgZmlsdGVyczwvaDM+PGhyPjwvZGl2Pjx1aWItcGFnaW5hdGlvbiB0b3RhbC1pdGVtcz1uZXdzRmVlZEN0cmwubWV0YS50b3RhbENvdW50IG5nLW1vZGVsPW5ld3NGZWVkQ3RybC5tZXRhLnBhZ2VJbmRleCBpdGVtcy1wZXItcGFnZT1uZXdzRmVlZEN0cmwubWV0YS5tYXhQZXJQYWdlIGNsYXNzPXBhZ2luYXRpb24tbGcgZGlyZWN0aW9uLWxpbmtzPWZhbHNlIGJvdW5kYXJ5LWxpbmtzPWZhbHNlIGRhdGEtbmctY2hhbmdlPW5ld3NGZWVkQ3RybC5wYWdlQ2hhbmdlZCgpIG51bS1wYWdlcz1uZXdzRmVlZEN0cmwubWV0YS5ub09mUGFnZXM+PC91aWItcGFnaW5hdGlvbj48L2Rpdj48ZGl2IGNsYXNzPWNvbC1tZC00PjxkaXYgY2xhc3M9d2VsbCBuZy1zaG93PVxcXCJuZXdzRmVlZEN0cmwubWV0YS5sb3dlckJvdW5kID09PSAwXFxcIj48aDQ+QmxvZyBTZWFyY2g8L2g0PjxkaXYgY2xhc3M9aW5wdXQtZ3JvdXA+PGlucHV0IHR5cGU9dGV4dCBuZy1tb2RlbD1uZXdzRmVlZEN0cmwuc2VhcmNoLnRlcm0gY2xhc3M9Zm9ybS1jb250cm9sPiA8c3BhbiBjbGFzcz1pbnB1dC1ncm91cC1idG4+PGJ1dHRvbiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0XFxcIiBuZy1jbGljaz1uZXdzRmVlZEN0cmwuc2VhcmNoKG5ld3NGZWVkQ3RybC5zZWFyY2gudGVybSkgdHlwZT1idXR0b24+PHNwYW4gY2xhc3M9XFxcImdseXBoaWNvbiBnbHlwaGljb24tc2VhcmNoXFxcIj48L3NwYW4+PC9idXR0b24+PC9zcGFuPjwvZGl2PjxkaXYgbmctc2hvdz1uZXdzRmVlZEN0cmwuc2VhcmNoLnNlbGVjdGVkPlNlYXJjaCBUZXJtOiB7e25ld3NEaXJlY3RvcnlDdHJsLnN0YXRlLnNlYXJjaC5zZWxlY3RlZH19PC9kaXY+PGRpdiBuZy1zaG93PW5ld3NGZWVkQ3RybC5zZWFyY2guc2VsZWN0ZWQ+PGJ1dHRvbiBuZy1jbGljaz1uZXdzRGlyZWN0b3J5Q3RybC5jbGVhcigpIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgbmV3cy1jbGVhci1zZWFyY2gtZmlsdGVyXFxcIiB0eXBlPWJ1dHRvbj5DbGVhciBzZWFyY2ggZmlsdGVyPC9idXR0b24+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz13ZWxsPjxoND5QYWdlczwvaDQ+PHA+PHVpYi1wYWdpbmF0aW9uIHRvdGFsLWl0ZW1zPW5ld3NGZWVkQ3RybC5tZXRhLnRvdGFsQ291bnQgbmctbW9kZWw9bmV3c0ZlZWRDdHJsLm1ldGEucGFnZUluZGV4IGl0ZW1zLXBlci1wYWdlPW5ld3NGZWVkQ3RybC5tZXRhLm1heFBlclBhZ2UgY2xhc3M9cGFnaW5hdGlvbi1zbSBkaXJlY3Rpb24tbGlua3M9ZmFsc2UgYm91bmRhcnktbGlua3M9ZmFsc2UgZGF0YS1uZy1jaGFuZ2U9bmV3c0ZlZWRDdHJsLnBhZ2VDaGFuZ2VkKCkgbnVtLXBhZ2VzPW5ld3NGZWVkQ3RybC5tZXRhLm5vT2ZQYWdlcz48L3VpYi1wYWdpbmF0aW9uPjwvcD48aDQ+SXRlbXMgcGVyIHBhZ2U8L2g0PjxwPjxuYXY+PHVsIGNsYXNzPXBhZ2luYXRpb24+PGxpIGRhdGEtbmctcmVwZWF0PVxcXCJwYWdlT3B0IGluIG5ld3NGZWVkQ3RybC5tZXRhLm1heFBlclBhZ2VPcHRzXFxcIiBuZy1jbGFzcz1cXFwicGFnZU9wdCA9PSBuZXdzRmVlZEN0cmwubWV0YS5tYXhQZXJQYWdlID8gJ2FjdGl2ZSc6ICcnXFxcIj48YSBocmVmPVxcXCJcXFwiIG5nLWNsaWNrPW5ld3NGZWVkQ3RybC5zZXRNYXhQZXJQYWdlKHBhZ2VPcHQpPnt7cGFnZU9wdH19PC9hPjwvbGk+PC91bD48L25hdj48L3A+PC9kaXY+PC9kaXY+PC9kaXY+XCI7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9uZXdzL3BhcnRpYWxzL25ld3NGZWVkLmh0bWxcIixcIi9tb2R1bGVzL25ld3MvcGFydGlhbHNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5tb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1yb3c+PGRpdiBjbGFzcz1jb2wtbGctOD48ZGl2IGNsYXNzPXJvdz48ZGl2IGNsYXNzPWNvbC1tZC0xMj48bmV3cy1hcnRpY2xlIGFydGljbGU9bmV3c1BhZ2VDdHJsLmFydGljbGU+PC9uZXdzLWFydGljbGU+PGhyPjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9Y29sLW1kLTQ+PGRpdiBjbGFzcz13ZWxsPjxoND5TaGFyZSBhcnRpY2xlPC9oND48cD48YSBocmVmPWh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8gdGFyZ2V0PV9ibGFuayB0aXRsZT1GYWNlYm9vayBjbGFzcz1mb290ZXItZmFjZWJvb2s+PGltZyBzcmM9L2ltYWdlcy9mYWNlYm9vay5wbmcgc3R5bGU9XFxcImJhY2tncm91bmQtcG9zaXRpb246IDAgLTM4cHhcXFwiPjwvYT48L3A+PC9kaXY+PC9kaXY+PC9kaXY+XCI7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9uZXdzL3BhcnRpYWxzL25ld3NQYWdlLmh0bWxcIixcIi9tb2R1bGVzL25ld3MvcGFydGlhbHNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbmV3c1JvdXRlcyA9IGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gIC5zdGF0ZSgnbmV3cycsIHtcbiAgICB1cmw6ICcvbmV3cycsXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL3BhcnRpYWxzL25ld3NGZWVkLmh0bWwnKSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBsaXN0OiBbJ05ld3NTZXJ2aWNlJywgZnVuY3Rpb24obmV3c1NlcnZpY2UpIHtcbiAgICAgICAgcmV0dXJuIG5ld3NTZXJ2aWNlLmxpc3QoKTtcbiAgICAgIH1dXG4gICAgfSxcbiAgICBjb250cm9sbGVyOiAnTmV3c0ZlZWRDb250cm9sbGVyJyxcbiAgICBjb250cm9sbGVyQXM6ICduZXdzRmVlZEN0cmwnXG4gIH0pXG4gIC5zdGF0ZSgnbmV3c0FydGljbGUnLCB7XG4gICAgdXJsOiAnL25ld3MvOmlkJyxcbiAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vcGFydGlhbHMvbmV3c1BhZ2UuaHRtbCcpLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFydGljbGU6IFsnTmV3c1NlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24obmV3c1NlcnZpY2UsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICByZXR1cm4gbmV3c1NlcnZpY2UuZ2V0KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgICB9XVxuICAgIH0sXG4gICAgY29udHJvbGxlcjogJ05ld3NQYWdlQ29udHJvbGxlcicsXG4gICAgY29udHJvbGxlckFzOiAnbmV3c1BhZ2VDdHJsJ1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gWyckc3RhdGVQcm92aWRlcicsIG5ld3NSb3V0ZXNdO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL25ld3Mvcm91dGVzL25ld3NSb3V0ZXMuanNcIixcIi9tb2R1bGVzL25ld3Mvcm91dGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIE5ld3NTZXJ2aWNlID0gZnVuY3Rpb24gKGNvbW1zU2VydmljZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuY29tbXMgPSBjb21tc1NlcnZpY2UuZ2V0UmVzb3VyY2UoJ25ld3MnKTtcblxuICAgIHNlbGYubGlzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5jb21tcy5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YVswXTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHNlbGYuZ2V0ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY29tbXMuZ2V0KGlkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gWydDb21tc1NlcnZpY2UnLCBOZXdzU2VydmljZV07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlcy9uZXdzL3NlcnZpY2VzL05ld3NTZXJ2aWNlLmpzXCIsXCIvbW9kdWxlcy9uZXdzL3NlcnZpY2VzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIHNpdGVDb25maWcgPSBhbmd1bGFyLm1vZHVsZSgnc2l0ZS5jb25maWcnLCBbJ2V6ZmInXSlcbiAgLmNvbnN0YW50KCdzaXRlQ29uZmlnJywge1xuICAgIHJvb3Q6ICdodHRwOi8vZGFuaWVsamFtZXNmb2xleS5jby51aycsXG4gICAgYmFja2VuZEJhc2U6ICdodHRwOi8vZGFuaWVsamFtZXNmb2xleS5jby51ay8nLFxuICAgIGFwcE5hbWU6ICdEZW1vIEFwcGxpY2F0aW9uJyxcbiAgICBhcHBWZXJzaW9uOiAxXG4gIH0pO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzL3NpdGUtY29uZmlnL2luZGV4LmpzXCIsXCIvbW9kdWxlcy9zaXRlLWNvbmZpZ1wiKSJdfQ==

}()); /* footer */
