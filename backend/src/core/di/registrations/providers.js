import {MailtrapClient} from "mailtrap";
import {v2 as cloudinary} from "cloudinary";
import Stripe from "stripe";
import mongoose from 'mongoose';
import Redis from "ioredis";

import {MongooseDatabaseProvider} from "../../../infrastructure/providers/database/MongooseDatabaseProvider.js";
import {RedisCacheProvider} from "../../../infrastructure/providers/cache/RedisCacheProvider.js";
import {MemoryCacheProvider} from "../../../infrastructure/providers/cache/MemoryCacheProvider.js";
import {CloudinaryStorageProvider} from "../../../infrastructure/providers/storage/CloudinaryStorageProvider.js";
import {EmailSender, MailTrapEmailProvider} from "../../../infrastructure/providers/email/MailTrapEmailProvider.js";
import {StripeProvider} from "../../../infrastructure/providers/payment/StripeProvider.js";

import {CacheType} from "../../../enums/infrastructure.ts";
import {ProviderTypes} from "../../../constants/ioc.js";

import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerProviders = (container) => {
    container.register(ProviderTypes.DATABASE, () => {
        const uri = config.infrastructure.providers.database.mongo.uri;
        const isProduction = config.server.isProduction;

        return new MongooseDatabaseProvider(mongoose, uri, isProduction)
    });
    container.register(ProviderTypes.CACHE, () => {
        const cacheType = config.infrastructure.providers.cache.type;

        if (cacheType === CacheType.REDIS) {
            const client = new Redis(config.infrastructure.providers.cache.redis.url, {
                lazyConnect: true,
                maxRetriesPerRequest: 1,
                retryStrategy(times) {
                    if (times > 3) return null;
                    return Math.min(times * 100, 3000);
                }
            });
            return new RedisCacheProvider(client);
        }

        return new MemoryCacheProvider();
    });
    container.register(ProviderTypes.STORAGE, () => {
        cloudinary.config({
            cloud_name: config.infrastructure.providers.storage.cloudinary.cloudName,
            api_key: config.infrastructure.providers.storage.cloudinary.apiKey,
            api_secret: config.infrastructure.providers.storage.cloudinary.apiSecret,
        });
        const isProduction = config.server.isProduction;

        return new CloudinaryStorageProvider(cloudinary, isProduction);
    });
    container.register(ProviderTypes.EMAIL, () => {
        const mailtrapClient = new MailtrapClient({
            token: config.infrastructure.providers.mail.mailtrap.token,
        });
        const sender = new EmailSender(
            config.infrastructure.providers.mail.mailtrap.sender.email,
            config.infrastructure.providers.mail.mailtrap.sender.name
        );

        return new MailTrapEmailProvider(mailtrapClient, sender)
    });
    container.register(ProviderTypes.PAYMENT, () => {
        const stripe = new Stripe(config.infrastructure.providers.payment.stripe.secretKey);
        const webhookSecret = config.infrastructure.providers.payment.stripe.webhookSecret;
        const {clientUrl} = config.server;
        const {successUrl, cancelUrl} = config.infrastructure.providers.payment.stripe;
        const formURL = (input, base) => new URL(input, base).toString();

        return new StripeProvider(stripe, webhookSecret, formURL(successUrl, clientUrl), formURL(cancelUrl, clientUrl));
    });
}

export default registerProviders;