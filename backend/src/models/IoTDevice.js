import mongoose from 'mongoose';

const IoTDeviceSchema = new mongoose.Schema({
  // Device Identity
  deviceId: {
    type: String,
    required: [true, 'Device ID is required'],
    unique: true,
    trim: true
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Device name is required'],
    trim: true,
    maxLength: [100, 'Device name cannot exceed 100 characters']
  },
  description: String,
  
  // Device Classification
  type: {
    type: String,
    required: [true, 'Device type is required'],
    enum: {
      values: [
        'tracker', 'sensor', 'lock', 'camera', 'beacon', 
        'environmental', 'security', 'monitoring', 'automation'
      ],
      message: 'Device type must be one of the predefined options'
    }
  },
  category: {
    type: String,
    enum: {
      values: [
        'location_tracking', 'condition_monitoring', 'access_control', 
        'usage_tracking', 'security', 'environmental', 'maintenance'
      ],
      message: 'Category must be one of the predefined options'
    }
  },
  subType: String, // More specific device classification
  
  // Ownership and Association
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Device owner is required']
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    sparse: true // Device can exist without being attached to a resource
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    sparse: true
  },
  
  // Device Status and Health
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'maintenance', 'faulty', 'offline', 'decommissioned'],
      message: 'Status must be one of the predefined options'
    },
    default: 'inactive'
  },
  isOnline: { type: Boolean, default: false },
  lastSeen: Date,
  batteryLevel: {
    type: Number,
    min: [0, 'Battery level cannot be negative'],
    max: [100, 'Battery level cannot exceed 100']
  },
  signalStrength: {
    type: Number,
    min: [-120, 'Signal strength too low'],
    max: [0, 'Signal strength too high']
  },
  
  // Technical Specifications
  specifications: {
    manufacturer: String,
    model: String,
    firmwareVersion: String,
    hardwareRevision: String,
    connectivity: {
      type: [String],
      enum: ['wifi', 'bluetooth', 'cellular', 'lora', 'zigbee', 'cellular_lte', 'nb_iot']
    },
    powerSource: {
      type: String,
      enum: ['battery', 'usb', 'solar', 'wired', 'hybrid']
    },
    operatingTemperature: {
      min: Number, // Celsius
      max: Number
    },
    ipRating: String, // IP65, IP67, etc.
    dimensions: {
      length: Number, // mm
      width: Number,
      height: Number,
      weight: Number // grams
    }
  },
  
  // Network and Communication
  network: {
    macAddress: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(v);
        },
        message: 'Invalid MAC address format'
      }
    },
    ipAddress: String,
    networkSSID: String,
    lastConnectedAt: Date,
    connectionHistory: [{
      connectedAt: { type: Date, default: Date.now },
      disconnectedAt: Date,
      duration: Number, // minutes
      reason: String
    }]
  },
  
  // Location and Positioning
  location: {
    current: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number], // [longitude, latitude]
      accuracy: Number, // meters
      timestamp: Date,
      source: {
        type: String,
        enum: ['gps', 'cell', 'wifi', 'bluetooth', 'manual']
      }
    },
    history: [{
      coordinates: [Number],
      accuracy: Number,
      timestamp: { type: Date, default: Date.now },
      speed: Number, // km/h
      heading: Number // degrees
    }],
    geofences: [{
      name: String,
      center: [Number], // [longitude, latitude]
      radius: Number, // meters
      alertOnEnter: { type: Boolean, default: true },
      alertOnExit: { type: Boolean, default: true }
    }]
  },
  
  // Sensor Data and Capabilities
  sensors: [{
    type: {
      type: String,
      enum: [
        'accelerometer', 'gyroscope', 'magnetometer', 'temperature', 
        'humidity', 'pressure', 'light', 'proximity', 'sound', 
        'vibration', 'shock', 'tilt', 'motion'
      ]
    },
    unit: String,
    precision: Number,
    range: {
      min: Number,
      max: Number
    },
    calibrationDate: Date,
    isActive: { type: Boolean, default: true }
  }],
  
  // Real-time Data
  sensorData: [{
    sensorType: String,
    value: mongoose.Schema.Types.Mixed,
    unit: String,
    timestamp: { type: Date, default: Date.now },
    quality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    }
  }],
  
  // Events and Alerts
  events: [{
    type: {
      type: String,
      enum: [
        'movement_detected', 'shock_detected', 'temperature_alert', 
        'low_battery', 'offline', 'geofence_enter', 'geofence_exit',
        'tamper_detected', 'maintenance_due', 'unauthorized_access'
      ]
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical', 'emergency'],
      default: 'info'
    },
    message: String,
    data: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now },
    acknowledged: { type: Boolean, default: false },
    acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    acknowledgedAt: Date
  }],
  
  // Configuration and Settings
  configuration: {
    reportingInterval: { type: Number, default: 300 }, // seconds
    alertThresholds: {
      lowBattery: { type: Number, default: 20 }, // percentage
      highTemperature: Number,
      lowTemperature: Number,
      maxMovement: Number,
      inactivityTime: { type: Number, default: 3600 } // seconds
    },
    operatingMode: {
      type: String,
      enum: ['normal', 'power_save', 'high_performance', 'stealth'],
      default: 'normal'
    },
    enabledFeatures: [{
      feature: String,
      enabled: { type: Boolean, default: true },
      parameters: mongoose.Schema.Types.Mixed
    }]
  },
  
  // Usage and Analytics
  usage: {
    totalActivationTime: { type: Number, default: 0 }, // minutes
    totalDataPoints: { type: Number, default: 0 },
    averageReportingInterval: Number,
    reliabilityScore: { type: Number, default: 100, min: 0, max: 100 },
    maintenanceCount: { type: Number, default: 0 },
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date
  },
  
  // Security and Authentication
  security: {
    authToken: String,
    apiKey: String,
    certificateSerial: String,
    lastAuthenticationAt: Date,
    failedAuthAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockedUntil: Date,
    encryptionEnabled: { type: Boolean, default: true }
  },
  
  // Firmware and Updates
  firmware: {
    currentVersion: String,
    availableVersion: String,
    lastUpdateAt: Date,
    updateScheduled: Date,
    autoUpdateEnabled: { type: Boolean, default: false },
    updateHistory: [{
      version: String,
      updatedAt: { type: Date, default: Date.now },
      success: { type: Boolean, default: true },
      notes: String
    }]
  },
  
  // Integration and API
  integration: {
    webhookUrl: String,
    apiEndpoint: String,
    dataFormat: {
      type: String,
      enum: ['json', 'xml', 'csv', 'binary'],
      default: 'json'
    },
    compressionEnabled: { type: Boolean, default: false },
    batchingEnabled: { type: Boolean, default: true },
    batchSize: { type: Number, default: 100 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
IoTDeviceSchema.index({ deviceId: 1 }, { unique: true });
IoTDeviceSchema.index({ owner: 1, status: 1 });
IoTDeviceSchema.index({ resource: 1 }, { sparse: true });
IoTDeviceSchema.index({ 'location.current.coordinates': '2dsphere' });
IoTDeviceSchema.index({ lastSeen: -1 });
IoTDeviceSchema.index({ status: 1, isOnline: 1 });

// Virtual for device uptime percentage
IoTDeviceSchema.virtual('uptimePercentage').get(function() {
  if (!this.createdAt) return 0;
  
  const totalTime = Date.now() - this.createdAt.getTime();
  const downtime = this.network.connectionHistory.reduce((total, conn) => {
    if (conn.disconnectedAt && conn.connectedAt) {
      return total + (conn.disconnectedAt.getTime() - conn.connectedAt.getTime());
    }
    return total;
  }, 0);
  
  const uptime = totalTime - downtime;
  return Math.round((uptime / totalTime) * 100);
});

// Virtual for current location
IoTDeviceSchema.virtual('currentLocation').get(function() {
  return this.location.current;
});

// Virtual for latest sensor readings
IoTDeviceSchema.virtual('latestReadings').get(function() {
  const readings = {};
  this.sensorData.forEach(data => {
    if (!readings[data.sensorType] || data.timestamp > readings[data.sensorType].timestamp) {
      readings[data.sensorType] = data;
    }
  });
  return readings;
});

// Pre-save middleware
IoTDeviceSchema.pre('save', function(next) {
  // Update location coordinates index
  if (this.isModified('location.current.coordinates')) {
    this.location.current.timestamp = new Date();
  }
  
  // Update reliability score based on connectivity
  if (this.isModified('network.connectionHistory')) {
    this.calculateReliabilityScore();
  }
  
  // Limit sensor data history (keep only last 1000 records per sensor)
  if (this.isModified('sensorData')) {
    const sensorGroups = {};
    this.sensorData.forEach(data => {
      if (!sensorGroups[data.sensorType]) {
        sensorGroups[data.sensorType] = [];
      }
      sensorGroups[data.sensorType].push(data);
    });
    
    // Keep only latest 1000 records per sensor type
    this.sensorData = [];
    Object.keys(sensorGroups).forEach(sensorType => {
      const sorted = sensorGroups[sensorType].sort((a, b) => b.timestamp - a.timestamp);
      this.sensorData.push(...sorted.slice(0, 1000));
    });
  }
  
  next();
});

// Static method to find devices by location
IoTDeviceSchema.statics.findNearby = function(longitude, latitude, maxDistance = 1000) {
  return this.find({
    'location.current.coordinates': {
      $near: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: maxDistance
      }
    },
    status: 'active'
  });
};

// Static method to get device analytics
IoTDeviceSchema.statics.getAnalytics = function(filters = {}) {
  const matchStage = { ...filters };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalDevices: { $sum: 1 },
        activeDevices: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        onlineDevices: {
          $sum: { $cond: ['$isOnline', 1, 0] }
        },
        averageBatteryLevel: { $avg: '$batteryLevel' },
        averageReliability: { $avg: '$usage.reliabilityScore' },
        deviceTypes: { $push: '$type' },
        totalDataPoints: { $sum: '$usage.totalDataPoints' }
      }
    },
    {
      $addFields: {
        onlinePercentage: {
          $multiply: [
            { $divide: ['$onlineDevices', '$totalDevices'] },
            100
          ]
        },
        activePercentage: {
          $multiply: [
            { $divide: ['$activeDevices', '$totalDevices'] },
            100
          ]
        }
      }
    }
  ]);
};

// Instance method to add sensor data
IoTDeviceSchema.methods.addSensorData = function(sensorType, value, unit = null) {
  const dataPoint = {
    sensorType,
    value,
    unit,
    timestamp: new Date()
  };
  
  this.sensorData.push(dataPoint);
  this.usage.totalDataPoints += 1;
  this.lastSeen = new Date();
  
  // Check for alert thresholds
  this.checkThresholds(sensorType, value);
  
  return this.save();
};

// Instance method to check alert thresholds
IoTDeviceSchema.methods.checkThresholds = function(sensorType, value) {
  const thresholds = this.configuration.alertThresholds;
  let alertTriggered = false;
  
  switch (sensorType) {
    case 'temperature':
      if (thresholds.highTemperature && value > thresholds.highTemperature) {
        this.addEvent('temperature_alert', 'warning', `High temperature detected: ${value}°C`);
        alertTriggered = true;
      } else if (thresholds.lowTemperature && value < thresholds.lowTemperature) {
        this.addEvent('temperature_alert', 'warning', `Low temperature detected: ${value}°C`);
        alertTriggered = true;
      }
      break;
    case 'battery':
      if (thresholds.lowBattery && value < thresholds.lowBattery) {
        this.addEvent('low_battery', 'warning', `Low battery: ${value}%`);
        alertTriggered = true;
      }
      break;
  }
  
  return alertTriggered;
};

// Instance method to add event
IoTDeviceSchema.methods.addEvent = function(type, severity = 'info', message = '', data = {}) {
  const event = {
    type,
    severity,
    message,
    data,
    timestamp: new Date()
  };
  
  this.events.push(event);
  
  // Limit events history (keep only last 500 events)
  if (this.events.length > 500) {
    this.events = this.events.slice(-500);
  }
  
  return event;
};

// Instance method to update location
IoTDeviceSchema.methods.updateLocation = function(longitude, latitude, accuracy = null, source = 'gps') {
  // Add to history
  if (this.location.current.coordinates.length === 2) {
    this.location.history.push({
      coordinates: this.location.current.coordinates,
      accuracy: this.location.current.accuracy,
      timestamp: this.location.current.timestamp || new Date()
    });
  }
  
  // Update current location
  this.location.current = {
    type: 'Point',
    coordinates: [longitude, latitude],
    accuracy,
    timestamp: new Date(),
    source
  };
  
  // Limit location history (keep only last 1000 points)
  if (this.location.history.length > 1000) {
    this.location.history = this.location.history.slice(-1000);
  }
  
  // Check geofences
  this.checkGeofences(longitude, latitude);
  
  this.lastSeen = new Date();
  return this.save();
};

// Instance method to check geofences
IoTDeviceSchema.methods.checkGeofences = function(longitude, latitude) {
  this.location.geofences.forEach(geofence => {
    const distance = this.calculateDistance(
      latitude, longitude,
      geofence.center[1], geofence.center[0]
    );
    
    const wasInside = this.location.current.coordinates ? 
      this.calculateDistance(
        this.location.current.coordinates[1], this.location.current.coordinates[0],
        geofence.center[1], geofence.center[0]
      ) <= geofence.radius : false;
    
    const isInside = distance <= geofence.radius;
    
    if (!wasInside && isInside && geofence.alertOnEnter) {
      this.addEvent('geofence_enter', 'info', `Entered geofence: ${geofence.name}`);
    } else if (wasInside && !isInside && geofence.alertOnExit) {
      this.addEvent('geofence_exit', 'info', `Exited geofence: ${geofence.name}`);
    }
  });
};

// Instance method to calculate distance between two points
IoTDeviceSchema.methods.calculateDistance = function(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Instance method to calculate reliability score
IoTDeviceSchema.methods.calculateReliabilityScore = function() {
  const connectionHistory = this.network.connectionHistory;
  if (connectionHistory.length === 0) return;
  
  const totalConnections = connectionHistory.length;
  const successfulConnections = connectionHistory.filter(conn => 
    conn.disconnectedAt && (conn.disconnectedAt - conn.connectedAt) > 60000 // > 1 minute
  ).length;
  
  const reliability = (successfulConnections / totalConnections) * 100;
  this.usage.reliabilityScore = Math.round(reliability);
};

// Instance method to get device health status
IoTDeviceSchema.methods.getHealthStatus = function() {
  const health = {
    overall: 'good',
    battery: 'good',
    connectivity: 'good',
    sensors: 'good',
    lastContact: 'good'
  };
  
  // Battery health
  if (this.batteryLevel < 20) {
    health.battery = 'critical';
    health.overall = 'critical';
  } else if (this.batteryLevel < 50) {
    health.battery = 'warning';
    if (health.overall === 'good') health.overall = 'warning';
  }
  
  // Connectivity health
  if (!this.isOnline) {
    health.connectivity = 'critical';
    health.overall = 'critical';
  } else if (this.signalStrength < -80) {
    health.connectivity = 'warning';
    if (health.overall === 'good') health.overall = 'warning';
  }
  
  // Last contact health
  const hoursSinceLastSeen = this.lastSeen ? 
    (Date.now() - this.lastSeen.getTime()) / (1000 * 60 * 60) : 999;
  
  if (hoursSinceLastSeen > 24) {
    health.lastContact = 'critical';
    health.overall = 'critical';
  } else if (hoursSinceLastSeen > 6) {
    health.lastContact = 'warning';
    if (health.overall === 'good') health.overall = 'warning';
  }
  
  return health;
};

export default mongoose.model('IoTDevice', IoTDeviceSchema);