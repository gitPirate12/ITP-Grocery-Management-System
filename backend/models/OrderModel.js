const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: [true, 'Order number is required'],
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: [true, 'Supplier reference is required']
    },
    items: [{
        itemCode: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Minimum quantity is 1']
        }
    }],
    pricing: {
        unitPrice: {
            type: Number,
            required: true,
            min: [0, 'Price cannot be negative']
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%']
        }
    },
    deliveryDate: {
        type: Date,
        required: [true, 'Delivery date is required'],
        validate: {
            validator: function(value) {
                return value > Date.now();
            },
            message: 'Delivery date must be in the future'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['credit', 'bank-transfer', 'cash-on-delivery'],
        required: true
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    }
}, {
    timestamps: {
        createdAt: 'orderDate',
        updatedAt: 'lastUpdated'
    },
    toJSON: { virtuals: true }
});

// Virtual for total price calculation
OrderSchema.virtual('pricing.total').get(function() {
    return this.items.reduce((total, item) => {
        return total + (item.quantity * this.pricing.unitPrice * (1 - (this.pricing.discount / 100)));
    }, 0);
});

// Indexes for common queries
OrderSchema.index({ 'items.itemCode': 1 });
OrderSchema.index({ deliveryDate: 1 });

module.exports = mongoose.model('Order', OrderSchema);