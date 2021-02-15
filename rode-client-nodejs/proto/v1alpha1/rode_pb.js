// source: proto/v1alpha1/rode.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var proto_v1alpha1_rode$attest_pb = require('../../proto/v1alpha1/rode-attest_pb.js');
goog.object.extend(proto, proto_v1alpha1_rode$attest_pb);
var proto_v1beta1_grafeas_pb = require('../../proto/v1beta1/grafeas_pb.js');
goog.object.extend(proto, proto_v1beta1_grafeas_pb);
goog.exportSymbol('proto.rode.v1alpha1.BatchCreateOccurrencesRequest', null, global);
goog.exportSymbol('proto.rode.v1alpha1.BatchCreateOccurrencesResponse', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.rode.v1alpha1.BatchCreateOccurrencesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rode.v1alpha1.BatchCreateOccurrencesRequest.repeatedFields_, null);
};
goog.inherits(proto.rode.v1alpha1.BatchCreateOccurrencesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.rode.v1alpha1.BatchCreateOccurrencesRequest.displayName = 'proto.rode.v1alpha1.BatchCreateOccurrencesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.rode.v1alpha1.BatchCreateOccurrencesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.rode.v1alpha1.BatchCreateOccurrencesResponse.repeatedFields_, null);
};
goog.inherits(proto.rode.v1alpha1.BatchCreateOccurrencesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.rode.v1alpha1.BatchCreateOccurrencesResponse.displayName = 'proto.rode.v1alpha1.BatchCreateOccurrencesResponse';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rode.v1alpha1.BatchCreateOccurrencesRequest.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.rode.v1alpha1.BatchCreateOccurrencesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.rode.v1alpha1.BatchCreateOccurrencesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rode.v1alpha1.BatchCreateOccurrencesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.rode.v1alpha1.BatchCreateOccurrencesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    occurrencesList: jspb.Message.toObjectList(msg.getOccurrencesList(),
    proto_v1beta1_grafeas_pb.Occurrence.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.rode.v1alpha1.BatchCreateOccurrencesRequest}
 */
proto.rode.v1alpha1.BatchCreateOccurrencesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rode.v1alpha1.BatchCreateOccurrencesRequest;
  return proto.rode.v1alpha1.BatchCreateOccurrencesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rode.v1alpha1.BatchCreateOccurrencesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rode.v1alpha1.BatchCreateOccurrencesRequest}
 */
proto.rode.v1alpha1.BatchCreateOccurrencesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_v1beta1_grafeas_pb.Occurrence;
      reader.readMessage(value,proto_v1beta1_grafeas_pb.Occurrence.deserializeBinaryFromReader);
      msg.addOccurrences(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.rode.v1alpha1.BatchCreateOccurrencesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rode.v1alpha1.BatchCreateOccurrencesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rode.v1alpha1.BatchCreateOccurrencesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.rode.v1alpha1.BatchCreateOccurrencesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOccurrencesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto_v1beta1_grafeas_pb.Occurrence.serializeBinaryToWriter
    );
  }
};


/**
 * repeated grafeas.v1beta1.Occurrence occurrences = 1;
 * @return {!Array<!proto.grafeas.v1beta1.Occurrence>}
 */
proto.rode.v1alpha1.BatchCreateOccurrencesRequest.prototype.getOccurrencesList = function() {
  return /** @type{!Array<!proto.grafeas.v1beta1.Occurrence>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_v1beta1_grafeas_pb.Occurrence, 1));
};


/**
 * @param {!Array<!proto.grafeas.v1beta1.Occurrence>} value
 * @return {!proto.rode.v1alpha1.BatchCreateOccurrencesRequest} returns this
*/
proto.rode.v1alpha1.BatchCreateOccurrencesRequest.prototype.setOccurrencesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.grafeas.v1beta1.Occurrence=} opt_value
 * @param {number=} opt_index
 * @return {!proto.grafeas.v1beta1.Occurrence}
 */
proto.rode.v1alpha1.BatchCreateOccurrencesRequest.prototype.addOccurrences = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.grafeas.v1beta1.Occurrence, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.rode.v1alpha1.BatchCreateOccurrencesRequest} returns this
 */
proto.rode.v1alpha1.BatchCreateOccurrencesRequest.prototype.clearOccurrencesList = function() {
  return this.setOccurrencesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.rode.v1alpha1.BatchCreateOccurrencesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.rode.v1alpha1.BatchCreateOccurrencesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.rode.v1alpha1.BatchCreateOccurrencesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.rode.v1alpha1.BatchCreateOccurrencesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.rode.v1alpha1.BatchCreateOccurrencesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    occurrencesList: jspb.Message.toObjectList(msg.getOccurrencesList(),
    proto_v1beta1_grafeas_pb.Occurrence.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.rode.v1alpha1.BatchCreateOccurrencesResponse}
 */
proto.rode.v1alpha1.BatchCreateOccurrencesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.rode.v1alpha1.BatchCreateOccurrencesResponse;
  return proto.rode.v1alpha1.BatchCreateOccurrencesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.rode.v1alpha1.BatchCreateOccurrencesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.rode.v1alpha1.BatchCreateOccurrencesResponse}
 */
proto.rode.v1alpha1.BatchCreateOccurrencesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto_v1beta1_grafeas_pb.Occurrence;
      reader.readMessage(value,proto_v1beta1_grafeas_pb.Occurrence.deserializeBinaryFromReader);
      msg.addOccurrences(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.rode.v1alpha1.BatchCreateOccurrencesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.rode.v1alpha1.BatchCreateOccurrencesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.rode.v1alpha1.BatchCreateOccurrencesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.rode.v1alpha1.BatchCreateOccurrencesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOccurrencesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto_v1beta1_grafeas_pb.Occurrence.serializeBinaryToWriter
    );
  }
};


/**
 * repeated grafeas.v1beta1.Occurrence occurrences = 1;
 * @return {!Array<!proto.grafeas.v1beta1.Occurrence>}
 */
proto.rode.v1alpha1.BatchCreateOccurrencesResponse.prototype.getOccurrencesList = function() {
  return /** @type{!Array<!proto.grafeas.v1beta1.Occurrence>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto_v1beta1_grafeas_pb.Occurrence, 1));
};


/**
 * @param {!Array<!proto.grafeas.v1beta1.Occurrence>} value
 * @return {!proto.rode.v1alpha1.BatchCreateOccurrencesResponse} returns this
*/
proto.rode.v1alpha1.BatchCreateOccurrencesResponse.prototype.setOccurrencesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.grafeas.v1beta1.Occurrence=} opt_value
 * @param {number=} opt_index
 * @return {!proto.grafeas.v1beta1.Occurrence}
 */
proto.rode.v1alpha1.BatchCreateOccurrencesResponse.prototype.addOccurrences = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.grafeas.v1beta1.Occurrence, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.rode.v1alpha1.BatchCreateOccurrencesResponse} returns this
 */
proto.rode.v1alpha1.BatchCreateOccurrencesResponse.prototype.clearOccurrencesList = function() {
  return this.setOccurrencesList([]);
};


goog.object.extend(exports, proto.rode.v1alpha1);
