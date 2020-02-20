const CHUNK_SIZE = 64 * 1024;

class FileChunker {
  constructor(file) {
    this.file = file;
    this.reader = new FileReader();
    this.offset = 0;
  }

  getNextChunk() {
    return new Promise((resolve, reject) => {
      if (this.offset >= this.file.size) {
        resolve({
          done: true,
        });
      }

      this.reader.onload = (e) => {
        const chunk = e.target.result;
        this.offset += chunk.byteLength;
        resolve({
          done: this.offset >= this.file.size,
          chunk,
          offset: this.offset,
        });
      };
      this.reader.onabort = () => {
        reject(new Error('FileReader abort'));
      };
      this.reader.onerror = (evt) => {
        reject(new Error('FileReader onerror' + evt));
      };
      const blob = this.file.slice(this.offset, this.offset + CHUNK_SIZE);
      this.reader.readAsArrayBuffer(blob);
    });
  }
}

export default FileChunker;
