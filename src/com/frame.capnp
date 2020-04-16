@0x95121194d6c74461;

struct CapnpOutput {

  struct CamSensor {
    idx @0 :Int32;
    key @1 :Text;
    timestamp @2 :Int64; # timestamp in [us]
    focalLengthX @3 :Float32; # in [px]
    focalLengthY @4 :Float32; # in [px]
    principalPointX @5 :Float32; # in [px]
    principalPointY @6 :Float32; # in [px]
    # position (autosar) in bumper coordinates in [m]
    x @7 :Float32;
    y @8 :Float32;
    z @9 :Float32;
    yaw @10 :Float32; # in [rad]
    roll @11 :Float32; # in [rad]
    pitch @12 :Float32; # in [rad]
    fovHorizontal @13 :Float32; # in [rad]
    fovVertical @14 :Float32; # in [rad]
    img @15 :Img;

    struct Img {
      width @0 :Int32; # in [px]
      height @1 :Int32; # in [px]
      channels @2 :Int16;
      data @3 :Data;
    }
  }

  struct RuntimeMeas {
    name @0 :Text;
    start @1 :Int64; # start timestamp in [us]
    duration @2 :Float64; # in [ms]
  }

  struct Track {
    trackId @0 :Text;
    # position (autosar) in bumper coordinates
    x @1 :Float32;
    y @2 :Float32;
    z @3 :Float32;
    # rotation (origin bottom center of object)
    yaw @4 :Float32;
    roll @5 :Float32;
    pitch @6 :Float32;
    height @7 :Float32;
    width @8 :Float32;
    length @9 :Float32;
    velocity @10 :Float32;
    objClass @11 :Int32;
  }

  struct Frame {
    timestamp @0 :Int64; # from the start of the app in [us] (is the latest of sensor input)
    frameStart @1 :Int64; # time of current frame start in [us]
                          # difference between frameStart and timestamp is the latency we have
    plannedFrameLength @2 :Float64; # planned length of the frame in [ms]
    frameCount @3 :Int64;
    tracks @4 :List(Track);
    camSensors @5 :List(CamSensor);
    runtimeMeas @6 :List(RuntimeMeas);
  }

}
