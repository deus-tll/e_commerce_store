import mongoose from "mongoose";
import {Redis} from "ioredis";
import {MailtrapClient} from "mailtrap";
import Stripe from "stripe";

import {Container} from "../Container.js";

import {IDatabaseProvider} from "../../../infrastructure/providers/database/IDatabaseProvider.js";
import {ICacheProvider} from "../../../infrastructure/providers/cache/ICacheProvider.js";
import {IStorageProvider} from "../../../infrastructure/providers/storage/IStorageProvider.js";
import {IEmailProvider} from "../../../infrastructure/providers/email/IEmailProvider.js";
import {IPaymentProvider} from "../../../infrastructure/providers/payment/IPaymentProvider.js";

import {MongooseDatabaseProvider} from "../../../infrastructure/providers/database/MongooseDatabaseProvider.js";
import {RedisCacheProvider} from "../../../infrastructure/providers/cache/RedisCacheProvider.js";
import {MemoryCacheProvider} from "../../../infrastructure/providers/cache/MemoryCacheProvider.js";
import {
    CloudinaryConfigOptions,
    CloudinaryStorageProvider
} from "../../../infrastructure/providers/storage/CloudinaryStorageProvider.js";
import {EmailSender, MailTrapEmailProvider} from "../../../infrastructure/providers/email/MailTrapEmailProvider.js";
import {StripeProvider} from "../../../infrastructure/providers/payment/StripeProvider.js";

import {CacheType} from "../../../enums/infrastructure.js";

import {config} from "../../../config.js";

const registerProviders = (container: Container): void => {
    // DATABASE
    //=======================
    container.register({
        token: IDatabaseProvider,
        implementation: MongooseDatabaseProvider
    }, [
        mongoose,
        config.infrastructure.providers.database.mongo.uri,
        config.server.isProduction
    ]);

    // CACHE
    //=======================
    container.register({
        token: Redis
    }, [
        config.infrastructure.providers.cache.redis.url,
        {
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            retryStrategy(times: number): number | null {
                if (times > 3) return null;
                return Math.min(times * 100, 3000);
            }
        }
    ]);

    const cacheType = config.infrastructure.providers.cache.type;
    const cacheImpl = cacheType === CacheType.REDIS
        ? RedisCacheProvider
        : MemoryCacheProvider;
    const cacheDeps = cacheType === CacheType.REDIS
        ? [Redis]
        : [];

    container.register({
        token: ICacheProvider,
        implementation: cacheImpl as any
    }, cacheDeps);

    // EMAIL
    //=======================
    const mailtrapClient = new MailtrapClient({
        token: config.infrastructure.providers.mail.mailtrap.token,
    });

    container.register({
        token: IEmailProvider,
        implementation: MailTrapEmailProvider
    }, [
        mailtrapClient,
        {
            email: config.infrastructure.providers.mail.mailtrap.sender.email,
            name: config.infrastructure.providers.mail.mailtrap.sender.name
        } satisfies EmailSender
    ]);

    // STORAGE
    //=======================
    container.register({
        token: IStorageProvider,
        implementation: CloudinaryStorageProvider
    }, [
        {
            cloudName: config.infrastructure.providers.storage.cloudinary.cloudName,
            apiKey: config.infrastructure.providers.storage.cloudinary.apiKey,
            apiSecret: config.infrastructure.providers.storage.cloudinary.apiSecret,
        } satisfies CloudinaryConfigOptions,
        config.server.isProduction
    ]);

    // PAYMENT
    //=======================
    const stripe = new Stripe(config.infrastructure.providers.payment.stripe.secretKey);

    const {clientUrl} = config.server;
    const {successUrl, cancelUrl} = config.infrastructure.providers.payment.stripe;
    const formURL = (input: string, base: string) => new URL(input, base).toString();

    container.register({
        token: IPaymentProvider,
        implementation: StripeProvider
    }, [
        stripe,
        config.infrastructure.providers.payment.stripe.webhookSecret,
        formURL(successUrl, clientUrl),
        formURL(cancelUrl, clientUrl)
    ]);
}

export default registerProviders;