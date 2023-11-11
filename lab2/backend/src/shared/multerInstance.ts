import multer from 'multer';

class MulterInstance {
    private static _instance: MulterInstance;

    private upload: any;

    constructor() {}

    static getInstance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new MulterInstance();
        return this._instance;
    }

    public init(folderPath: string) {
        const storage = multer.diskStorage({
            destination: (_, __, cb) => {
                cb(null, `src/uploads/${folderPath}`);
            },
            filename: (_, file, cb) => {
                cb(null, file.originalname);
            },
        });

        this.upload = multer({ storage });

        return this;
    }

    public getMulterUpload() {
        return this.upload;
    }
}

export default MulterInstance.getInstance();
