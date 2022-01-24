"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var keypoint_tracker_1 = require("./keypoint_tracker");
describe('Keypoint tracker', function () {
    var trackerConfig = {
        maxTracks: 4,
        maxAge: 1000,
        minSimilarity: 0.5,
        keypointTrackerParams: {
            keypointConfidenceThreshold: 0.2,
            keypointFalloff: [0.1, 0.1, 0.1, 0.1],
            minNumberOfKeypoints: 2
        }
    };
    it('Instantiate tracker', function () {
        var kptTracker = new keypoint_tracker_1.KeypointTracker(trackerConfig);
        expect(kptTracker instanceof keypoint_tracker_1.KeypointTracker).toBe(true);
    });
    it('Config validation fail on kpt confidence threshold', function () {
        var badConfig = {
            maxTracks: 4,
            maxAge: 1000,
            minSimilarity: 0.5,
            keypointTrackerParams: {
                keypointConfidenceThreshold: -0.1,
                keypointFalloff: [0.1, 0.1, 0.1, 0.1],
                minNumberOfKeypoints: 2
            }
        };
        expect(function () {
            return new keypoint_tracker_1.KeypointTracker(badConfig);
        })
            .toThrow(new Error('Must specify \'keypointConfidenceThreshold\' to be in the ' +
            'range [0, 1], but encountered -0.1'));
    });
    it('Compute OKS', function () {
        var kptTracker = new keypoint_tracker_1.KeypointTracker(trackerConfig);
        var pose = {
            keypoints: [
                { x: 0.2, y: 0.2, score: 1.0 }, { x: 0.4, y: 0.4, score: 0.8 },
                { x: 0.6, y: 0.6, score: 0.1 },
                { x: 0.8, y: 0.7, score: 0.8 }
            ]
        };
        var track = {
            id: 0,
            lastTimestamp: 1000000,
            keypoints: [
                { x: 0.2, y: 0.2, score: 1.0 }, { x: 0.4, y: 0.4, score: 0.8 },
                { x: 0.6, y: 0.6, score: 0.9 }, { x: 0.8, y: 0.8, score: 0.8 }
            ]
        };
        var oks = kptTracker['oks'](pose, track);
        var boxArea = (0.8 - 0.2) * (0.8 - 0.2);
        var x = 2 * trackerConfig.keypointTrackerParams.keypointFalloff[3];
        var d = 0.1;
        var expectedOks = (1 + 1 + Math.exp(-1 * Math.pow(d, 2) / (2 * boxArea * Math.pow(x, 2)))) / 3;
        expect(oks).toBeCloseTo(expectedOks, 6);
    });
    it('Compute OKS returns 0.0 with less than 2 valid keypoints', function () {
        var kptTracker = new keypoint_tracker_1.KeypointTracker(trackerConfig);
        var pose = {
            keypoints: [
                { x: 0.2, y: 0.2, score: 1.0 },
                { x: 0.4, y: 0.4, score: 0.1 },
                { x: 0.6, y: 0.6, score: 0.9 }, { x: 0.8, y: 0.8, score: 0.8 }
            ]
        };
        var track = {
            id: 0,
            lastTimestamp: 1000000,
            keypoints: [
                { x: 0.2, y: 0.2, score: 1.0 }, { x: 0.4, y: 0.4, score: 0.8 },
                { x: 0.6, y: 0.6, score: 0.1 },
                { x: 0.8, y: 0.8, score: 0.0 } // Low confidence.
            ]
        };
        var oks = kptTracker['oks'](pose, track);
        expect(oks).toBeCloseTo(0.0, 6);
    });
    it('Compute area', function () {
        var kptTracker = new keypoint_tracker_1.KeypointTracker(trackerConfig);
        var keypoints = [
            { x: 0.1, y: 0.2, score: 1.0 }, { x: 0.3, y: 0.4, score: 0.9 },
            { x: 0.4, y: 0.6, score: 0.9 },
            { x: 0.7, y: 0.8, score: 0.1 } // Low confidence.
        ];
        var area = kptTracker['area'](keypoints);
        var expectedArea = (0.4 - 0.1) * (0.6 - 0.2);
        expect(area).toBeCloseTo(expectedArea, 6);
    });
    it('Apply keypoint tracker', function () {
        // Timestamp: 0. Pose becomes the only track.
        var kptTracker = new keypoint_tracker_1.KeypointTracker(trackerConfig);
        var tracks;
        var poses = [{
                keypoints: [
                    // Becomes id = 1.
                    { x: 0.2, y: 0.2, score: 1.0 }, { x: 0.4, y: 0.4, score: 0.8 },
                    { x: 0.6, y: 0.6, score: 0.9 },
                    { x: 0.8, y: 0.8, score: 0.0 } // Low confidence.
                ]
            }];
        poses = kptTracker.apply(poses, 0);
        tracks = kptTracker.getTracks();
        expect(poses.length).toEqual(1);
        expect(poses[0].id).toEqual(1);
        expect(tracks.length).toEqual(1);
        expect(tracks[0].id).toEqual(1);
        expect(tracks[0].lastTimestamp).toEqual(0);
        // Timestamp: 100000. First pose is linked with track 1. Second pose spawns
        // a new track (id = 2).
        poses = [
            { keypoints: [
                    { x: 0.2, y: 0.2, score: 1.0 },
                    { x: 0.4, y: 0.4, score: 0.8 },
                    { x: 0.6, y: 0.6, score: 0.9 },
                    { x: 0.8, y: 0.8, score: 0.8 }
                ] },
            { keypoints: [
                    { x: 0.8, y: 0.8, score: 0.8 },
                    { x: 0.6, y: 0.6, score: 0.3 },
                    { x: 0.4, y: 0.4, score: 0.1 },
                    { x: 0.2, y: 0.2, score: 0.8 }
                ] }
        ];
        poses = kptTracker.apply(poses, 100000);
        tracks = kptTracker.getTracks();
        expect(poses.length).toEqual(2);
        expect(poses[0].id).toEqual(1);
        expect(poses[1].id).toEqual(2);
        expect(tracks.length).toEqual(2);
        expect(tracks[0].id).toEqual(1);
        expect(tracks[0].lastTimestamp).toEqual(100000);
        expect(tracks[1].id).toEqual(2);
        expect(tracks[1].lastTimestamp).toEqual(100000);
        // Timestamp: 900000. First pose is linked with track 2. Second pose spawns
        // a new track (id = 3).
        poses = [
            { keypoints: [
                    { x: 0.6, y: 0.7, score: 0.7 },
                    { x: 0.5, y: 0.6, score: 0.7 },
                    { x: 0.0, y: 0.0, score: 0.1 },
                    { x: 0.2, y: 0.1, score: 1.0 }
                ] },
            { keypoints: [
                    { x: 0.5, y: 0.1, score: 0.6 },
                    { x: 0.9, y: 0.3, score: 0.6 },
                    { x: 0.1, y: 1.0, score: 0.9 },
                    { x: 0.4, y: 0.4, score: 0.1 } // Low confidence.
                ] },
        ];
        poses = kptTracker.apply(poses, 900000);
        tracks = kptTracker.getTracks();
        expect(poses.length).toEqual(2);
        expect(poses[0].id).toEqual(2);
        expect(poses[1].id).toEqual(3);
        expect(tracks.length).toEqual(3);
        expect(tracks[0].id).toEqual(2);
        expect(tracks[0].lastTimestamp).toEqual(900000);
        expect(tracks[1].id).toEqual(3);
        expect(tracks[1].lastTimestamp).toEqual(900000);
        expect(tracks[2].id).toEqual(1);
        expect(tracks[2].lastTimestamp).toEqual(100000);
        // Timestamp: 1200000. First pose spawns a new track (id = 4), even though
        // it has the same keypoints as track 1. This is because the age exceeds
        // 1000 msec. The second pose links with id 2. The third pose spawns a new
        // track (id = 5).
        poses = [
            { keypoints: [
                    { x: 0.2, y: 0.2, score: 1.0 },
                    { x: 0.4, y: 0.4, score: 0.8 },
                    { x: 0.6, y: 0.6, score: 0.9 },
                    { x: 0.8, y: 0.8, score: 0.8 }
                ] },
            { keypoints: [
                    { x: 0.55, y: 0.7, score: 0.7 },
                    { x: 0.5, y: 0.6, score: 0.9 },
                    { x: 1.0, y: 1.0, score: 0.1 },
                    { x: 0.8, y: 0.1, score: 0.0 } // Low confidence.
                ] },
            { keypoints: [
                    { x: 0.1, y: 0.1, score: 0.1 },
                    { x: 0.2, y: 0.2, score: 0.9 },
                    { x: 0.3, y: 0.3, score: 0.7 },
                    { x: 0.4, y: 0.4, score: 0.8 }
                ] },
        ];
        poses = kptTracker.apply(poses, 1200000);
        tracks = kptTracker.getTracks();
        expect(poses.length).toEqual(3);
        expect(poses[0].id).toEqual(4);
        expect(poses[1].id).toEqual(2);
        expect(tracks.length).toEqual(4);
        expect(tracks[0].id).toEqual(2);
        expect(tracks[0].lastTimestamp).toEqual(1200000);
        expect(tracks[1].id).toEqual(4);
        expect(tracks[1].lastTimestamp).toEqual(1200000);
        expect(tracks[2].id).toEqual(5);
        expect(tracks[2].lastTimestamp).toEqual(1200000);
        expect(tracks[3].id).toEqual(3);
        expect(tracks[3].lastTimestamp).toEqual(900000);
        // Timestamp: 1300000. First pose spawns a new track (id = 6). Since
        // maxTracks is 4, the oldest track (id = 3) is removed.
        poses = [
            { keypoints: [
                    { x: 0.1, y: 0.8, score: 1.0 },
                    { x: 0.2, y: 0.9, score: 0.6 },
                    { x: 0.2, y: 0.9, score: 0.5 },
                    { x: 0.8, y: 0.2, score: 0.4 }
                ] },
        ];
        poses = kptTracker.apply(poses, 1300000);
        tracks = kptTracker.getTracks();
        expect(poses.length).toEqual(1);
        expect(poses[0].id).toEqual(6);
        expect(tracks.length).toEqual(4);
        expect(tracks[0].id).toEqual(6);
        expect(tracks[0].lastTimestamp).toEqual(1300000);
        expect(tracks[1].id).toEqual(2);
        expect(tracks[1].lastTimestamp).toEqual(1200000);
        expect(tracks[2].id).toEqual(4);
        expect(tracks[2].lastTimestamp).toEqual(1200000);
        expect(tracks[3].id).toEqual(5);
        expect(tracks[3].lastTimestamp).toEqual(1200000);
    });
});
//# sourceMappingURL=keypoint_tracker_test.js.map