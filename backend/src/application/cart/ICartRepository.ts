import {CartItem} from "../../entities/cart/CartValueObjects.js";
import {CartEntity} from "../../entities/cart/CartEntity.js";

export abstract class ICartRepository {
	abstract addItemOrIncrementQuantity(userId: string, productId: string): Promise<CartEntity | null>;
	abstract removeItem(userId: string, productId: string): Promise<CartEntity | null>;

	/**
	 * Updates the quantity of a specific item in the cart. If quantity is 0, the item is removed.
	 */
	abstract updateItemQuantity(userId: string, productId: string, quantity: number): Promise<CartEntity | null>;
	abstract updateItemsByUserId(userId: string, newItems: CartItem[]): Promise<CartEntity | null>;
	abstract findByUserId(userId: string): Promise<CartEntity | null>;
}