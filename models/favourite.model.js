const mongoose = require('mongoose');

const favouritesSchema = new mongoose.Schema(
    {
        audios: [
            {
                type: mongoose.Schema.Types.Mixed,
                ref: 'Audio',
            },
        ],
        favId: {
            type: Number,
            unique: true,
        },
    },
    {
        timestamps: {
            currentTime: () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            createdAt: 'created_at',
        },
    }
);

favouritesSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            let isUnique = false;
            let newFavId;

            while (!isUnique) {
                newFavId = Math.floor(Math.random() * 1000000); 

                const existingFavourite = await this.constructor.findOne({ favId: newFavId });

                if (!existingFavourite) {
                    isUnique = true;
                }
            }

            this.favId = newFavId;

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Favourite = mongoose.model('Favourite', favouritesSchema);

module.exports = Favourite;
