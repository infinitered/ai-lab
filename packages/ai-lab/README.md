## Interface: ModelInfo

### Properties

- **`iouThreshold`**: **number** (optional)
  The the allowed area for intersection over union (IOU) between the bounding box with other bounding boxes.
- **`maxBoxes`**: **number**
  The number of boxes to keep after applying NMS.
- **`modelType`**: **undefined** | **undefined**
  The model type, which identifies the output structure to expect.
- **`nmsActive`**: **boolean** (optional)
  The soft NMS Sigma that allows overlapping of strong object confidence.
- **`threshold`**: **number** (optional)
  The score threshold to identify if a value is returned.

## Interface: VideoProps

## Interface: ObjectDetectionUIProps

### Properties

- **`detectionResults`**: ****
- **`height`**: **number**
- **`modelInfo`**: **ModelInfo**
- **`onDrawComplete`**: **** (optional)
- **`width`**: **number**
