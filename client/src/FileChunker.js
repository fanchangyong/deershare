const CHUNK_SIZE = 16 * 1024;

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
        this.offset += CHUNK_SIZE;
        resolve({
          done: this.offset >= this.file.size,
          chunk: e.target.result,
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
