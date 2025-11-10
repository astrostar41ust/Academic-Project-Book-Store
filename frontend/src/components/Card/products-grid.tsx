"use client";

import React from "react";
import { cn } from "@heroui/react";

import ProductListItem from "./product-list-item";
import { useCart } from "../../context/CartContext"; // Import useCart
import type { Book } from "../../types/index";
import products from "./products";

export type ProductGridProps = React.HTMLAttributes<HTMLDivElement> & {
  itemClassName?: string;
};

const ProductsGrid = React.forwardRef<HTMLDivElement, ProductGridProps>(
  ({ itemClassName, className, ...props }, ref) => {
    const { cart } = useCart();
    const products: ProductItem[] =
      cart?.items?.map((book: Book) => ({
        id: book.id?.toString() ?? "",
        name: book.title ?? "ไม่มีชื่อหนังสือ",
        href: `#/book/${book.id}`,
        price: book.price ?? 0,
        color: "default",
        size: "N/A",
        imageSrc: book.coverUrl || "/placeholder.png",
      })) ?? [];
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 rounded-2xl",
          className
        )}
        {...props}
      >
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            {...product}
            className={cn("w-full snap-start", itemClassName)}
          />
        ))}
      </div>
    );
  }
);

ProductsGrid.displayName = "ProductsGrid";

export default ProductsGrid;
