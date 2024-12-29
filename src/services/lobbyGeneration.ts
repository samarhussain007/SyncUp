import { v4 as uuidv4 } from "uuid";
import redis from "../redis";

type JamType = "Private" | "Public";

interface JamConfigs {
  jamType: JamType;
  jamName: string;
  NoOfFollowers: number;
}

export interface CreateJamInputs {
  userId: number;
  jamInputs: JamConfigs;
}
export const createJam = async (createJamInputs: CreateJamInputs) => {
  try {
    const { userId, jamInputs } = createJamInputs;
    const uniqueId = createJamID();

    const jamConfigs = {
      uniqueId,
      userId,
      ...jamInputs,
    };

    // Check if the user is already looking for a match
    const existingMatch = await redis.hget(`user:${userId}:jam`, "uniqueId");

    //

    console.log("existingMatch", existingMatch);
    if (existingMatch) {
      throw new Error("User is already looking for a match.");
    }

    const jamCode = await createJamCode();
    let jamConfigsFinal = {
      jamCode,
      jamStatus: "not_started",
      ...jamConfigs,
    };

    // Save the jamConfigs in Redis as a hash
    const pipeline = redis.pipeline();
    Object.keys(jamConfigsFinal).forEach((key) => {
      // Typecast `key` to a valid key of `jamConfigs`
      pipeline.hset(
        `user:${userId}:jam`,
        key,
        jamConfigsFinal[key as keyof typeof jamConfigsFinal]
      );
    });

    // Set an expiration time (TTL of 1 hour)
    // pipeline.expire(`user:${userId}:jam`, 3600); // TTL of 1 hour

    await pipeline.exec();

    return jamConfigsFinal;
  } catch (err: any) {
    console.error("Error in createJam:", err.message || err);
    throw new Error("Failed to create a jam.");
  }
};

const createJamID = () => {
  return `jam-${uuidv4()}`;
};

const createJamCode = async (): Promise<string> => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  let isDuplicate = true;

  while (isDuplicate) {
    // Generate a new 6-character code
    result = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }

    // Check Redis to see if the code already exists
    const exists = await redis.exists(`jamCode:${result}`);
    if (!exists) {
      // If the code does not exist, save it to Redis and return it
      await redis.set(`jamCode:${result}`, "exists", "EX", 3600); // Set with an expiration time (1 hour TTL)
      isDuplicate = false;
    }
  }

  return result;
};

export const getAllAvailableJams = async () => {
  try {
    // Initialize an empty array to store all available jams
    const availableJams: any[] = [];

    // Scan for all keys starting with 'user:' which will contain jam info
    let cursor = "0"; // Starting point for SCAN
    let isScanning = true;

    while (isScanning) {
      // Use SCAN to find keys related to jams (can match with a pattern)
      const [newCursor, keys] = await redis.scan(cursor, "MATCH", "user:*:jam");
      cursor = newCursor;

      // Loop through the found keys and fetch the jam data
      for (const key of keys) {
        const jamData = await redis.hgetall(key); // Get all fields of the hash

        // Push the jam data to the result array
        availableJams.push(jamData);
      }

      // If cursor is 0, the scan is complete
      isScanning = cursor !== "0";
    }

    console.log(availableJams);

    return availableJams.filter(
      (el) => el.jamType !== "Private" && el.jamStatus === "not_started"
    );
  } catch (err: any) {
    console.error("Error in getAllAvailableJams:", err.message || err);
    throw new Error("Failed to retrieve available jams.");
  }
};

export const getJamByJamCode = async (jamCode: string) => {
  try {
    // Step 1: Fetch all the keys representing users' jam configurations in Redis
    const keys = await redis.keys("user:*:jam");

    // Step 2: Loop through all keys and check if the jamCode exists
    for (const key of keys) {
      const jamData = await redis.hgetall(key); // Get all fields for each user's jam

      // Step 3: Check if the jamCode exists in the user's jam data
      if (jamData.jamCode === jamCode) {
        // Step 4: If a match is found, check if the jam is not started and return the jam
        if (jamData.jamStatus === "not_started") {
          return jamData;
        }
      }
    }

    // Step 5: If no matching jam is found, throw an error
    throw new Error(
      "Jam not found or already started for the provided jamCode."
    );
  } catch (err: any) {
    console.error("Error in getJamByJamCode:", err.message || err);
    throw new Error("Failed to fetch jam data.");
  }
};
