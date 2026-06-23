import {CartItem} from "../../entities/cart/types/CartItem.js";
import {CartEntity} from "../../entities/cart/CartEntity.js";

export abstract class ICartRepository {
	abstract addItemOrIncrementQuantity(userId: string, productId: string): Promise<CartEntity>;
	abstract removeItem(userId: string, productId: string): Promise<CartEntity>;

	/**
	 * Updates the quantity of a specific item in the cart. If quantity is 0, the item is removed.
	 */
	abstract updateItemQuantity(userId: string, productId: string, quantity: number): Promise<CartEntity>;
	abstract updateItemsByUserId(userId: string, newItems: CartItem[]): Promise<CartEntity>;
	abstract findByUserId(userId: string): Promise<CartEntity | null>;
}