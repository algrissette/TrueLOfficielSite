// ===== Product Query Types =====
export type Products = {
    edges: ProductEdge[]
    pageInfo: {
        hasNextPage: boolean
        endCursor: string | null
    }
}

export type ProductEdge = {
    cursor: string
    node: ProductNode
}

export type ProductNode = {
    id: string
    title: string
    handle: string
    status: string
    createdAt: string
    updatedAt: string
    options: ProductOption[]
    variants: Variants
}

export type ProductOption = {
    name: string
    values: string[]
}

export type Variants = {
    edges: VariantEdge[]
}

export type VariantEdge = {
    node: VariantNode
}

export type VariantNode = {
    id: string
    image: Image
}

export type Image = {
    url: string
    altText: string
}

// Quick search products
export type QuickSearchProducts = {
    nodes: ProductNodeSimple[]
}

export type ProductNodeSimple = {
    title: string
}






// ===== Cart Types =====
export type MoneyForm = {
    amount: string
    currencyCode: string
}

export type ProductVariant = {
    id: string
    title: string
    availableForSale: boolean
    price: MoneyForm
    compareAtPrice?: MoneyForm | null
    image?: { id: string; altText?: string | null; url: string } | null
}

export type CartEdges = {
    cursor: string
    node: CartLine
}

export type CartLines = {
    edges: CartEdges[]
    pageInfo: { hasNextPage: boolean; endCursor: string | null }
}

export type CartLine = {
    id: string
    quantity: number
    merchandise: ProductVariant
}

export type CartCost = {
    totalAmount: MoneyForm
    subtotalAmount: MoneyForm
    totalTaxAmount?: MoneyForm | null
    totalDutyAmount?: MoneyForm | null
}

export type Cart = {
    id: string
    createdAt: string
    updatedAt: string
    checkoutUrl: string
    attributes: { key: string; value: string[] }[]
    cost: CartCost
    lines: CartLines
}

// Response types
export type CartQuery = {
    cart: Cart
    userErrors: { field: string; message: string }[]
    warnings: { code: string; message: string }[]
}

export type GetCartVariables = { input: string; cursor?: string | null }

// Update types
export type CartLineUpdate = { id: string; quantity: number }
export type UpdateCartInput = { cartId: string; lines: CartLineUpdate[] }
