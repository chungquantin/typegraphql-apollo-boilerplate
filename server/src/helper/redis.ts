import * as Redis from "ioredis";
import * as connectRedis from "connect-redis";
import { REDIS_SESSION_PREFIX } from "../constants/global-variables";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { EnvironmentType } from "../utils/environmentType";
import "dotenv/config";

export class REDIS {
	isProduction = process.env.NODE_ENV?.trim() == EnvironmentType.PROD;
	private readonly config: Redis.RedisOptions = {
		port: this.isProduction ? parseInt(process.env.REDIS_PORT as string) : 6379, // Redis port
		host: this.isProduction ? (process.env.REDIS_HOST as string) : "127.0.0.1", // Redis host,
		password: this.isProduction ? (process.env.REDIS_PASSWORD as string) : "",
	};
	public server = new Redis(this.config);
	public client = new Redis(this.config);
}

export const redisPubSub = new RedisPubSub({
	publisher: new REDIS().server,
	subscriber: new REDIS().client,
});

export const initializeRedisStore = (session: any): connectRedis.RedisStore => {
	const RedisStore = connectRedis(session);

	return new RedisStore({
		client: new REDIS().server,
		prefix: REDIS_SESSION_PREFIX,
	});
};
