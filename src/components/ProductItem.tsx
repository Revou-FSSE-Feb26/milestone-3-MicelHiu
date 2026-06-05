import { ProductItemProps } from "@/lib/data";
import { formatPrice } from "@/lib/data";

export function ProductItem({ product, onEdit, onDelete, disabled}: ProductItemProps) {
    return (
        <tr>
            <td className="admin-td">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-white text-black shrink-0">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="text-xl flex h-full w-full items-center justify-center">📦</div>
                        )}
                    </div>
                    <span className="font-bold text-black line-clamp-1">{product.name}</span>
                </div>
            </td>
            <td className="admin-td font-semibold text-gray-700">
                {formatPrice(product.price)}
            </td>
            <td className="admin-td pr-4">
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onEdit(product)}
                        disabled={disabled}
                        className="btn-edit text-sm font-medium text-black hover:text-slate-500 cursor-pointer"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(product.id)}
                        disabled={disabled}
                        className="btn-danger text-sm font-medium bg-red-500 px-1 py-1 rounded-lg text-black hover:text-slate-500 cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}