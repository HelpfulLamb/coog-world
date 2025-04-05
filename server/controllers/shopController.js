const db = require('../config/db');

exports.getUserShopPurchases = async (req, res) => {
    const userId = req.params.userId;

    try {
        const [purchases] = await db.query(`
            SELECT 
                pp.product_id,
                pp.purchase_created AS date,
                pp.purchase_price AS price,
                i.Item_name AS item
            FROM product_purchases pp
            JOIN inventory inv ON pp.product_id = inv.Inventory_ID
            JOIN items i ON inv.Item_ID = i.Item_ID
            WHERE pp.Transaction_ID IN (
                SELECT Transaction_ID FROM transactions WHERE Visitor_ID = ?
            ) AND pp.product_type = 'Shop'
            ORDER BY pp.purchase_created DESC
        `, [userId]);        

        res.status(200).json({ purchases });
    } catch (error) {
        console.error('Error fetching shop purchases:', error);
        res.status(500).json({ message: 'Error fetching purchases' });
    }
};