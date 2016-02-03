import json
import numpy as np
import sys

# can get these constants from:
#  https://msdn.microsoft.com/en-us/library/microsoft.kinect.kinect.jointtype.aspx
JOINT_INDEX_SHOULDER_RIGHT = 8
JOINT_INDEX_HAND_RIGHT = 11

def joint_to_vector(joint):
    return np.array([
            joint["cameraX"],
            joint["cameraY"],
            joint["cameraZ"]
        ])

def compute_arm_length(body):
    shoulder_joint =    body["joints"][JOINT_INDEX_SHOULDER_RIGHT]
    hand_joint =        body["joints"][JOINT_INDEX_HAND_RIGHT]
    shoulder_pos = joint_to_vector(shoulder_joint)
    hand_pos = joint_to_vector(hand_joint)
    return np.linalg.norm(shoulder_pos - hand_pos)

def compute_arm_lengths(frames):
    lengths = []
    positions = []

    for frame in frames:
        curbody = get_tracked_body(frame["bodies"])
        if curbody:
            lengths.append(compute_arm_length(curbody))
            positions.append(joint_to_vector(curbody["joints"][JOINT_INDEX_HAND_RIGHT]))

    return (lengths, positions)

def get_tracked_body(bodies):
    for body in bodies:
        if body["tracked"]:
            return body
    return None

if __name__ == '__main__':
    with open(sys.argv[1], "rt") as src:
        rawdata = json.load(src)

    lengths, positions = compute_arm_lengths(rawdata)

    # normalize lengths to be a fraction of the max length
    # (i.e., at full arm extension, length = 1)
    lengths = np.array(lengths)
    print("Max length is: " + str(np.max(lengths)))
    lengths = lengths / np.max(lengths)

    computed_result = [(curlen, list(curpos)) for (curlen, curpos) in zip(lengths, positions)]

    with open(sys.argv[2], "wt") as dest:
        json.dump(computed_result, dest, indent=4)