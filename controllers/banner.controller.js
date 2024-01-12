const Banner = require('../models/banner.model');

class BannerController {
    async getAllBanners(req, res) {
        try {
            const allBanners = await Banner.find();
            res.json({ success: true, banners: allBanners });
        } catch (error) {
            console.error('Error getting all banners:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    async addBanner(req, res) {
        const { name, category, type } = req.body;
        const image = '/uploads/' + req.file.originalname;

        try {
            const bannerId = await this.getNextBannerId();

            const newBanner = new Banner({
                bannerId,
                name,
                category,
                type,
                image,
            });

            await newBanner.save();

            res.send({ success: true, message: 'Banner added successfully!' });
        } catch (error) {
            console.error('Error saving banner:', error.message);
            res.status(500).send({ success: false, message: 'Internal Server Error' });
        }
    }


    async getNextBannerId() {
        const maxBannerId = await Banner.findOne({}).sort({ bannerId: -1 });
        return maxBannerId ? maxBannerId.bannerId + 1 : 1;
    }
}

module.exports = new BannerController();

