class PhotoUtil {
    public isPhotoFileType(fileName: string): boolean {
        if(!fileName)return false;

        const extensions = [".jpg", "jpeg", ".png", ".gif", "bmp", ".webp","tiff","heif","svg"]

        for (const extension of extensions)
            if (fileName.endsWith(extension)) return true
        
        return false;
    }

}

export const photoUtil = new PhotoUtil();