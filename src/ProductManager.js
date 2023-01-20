const fs = require('fs');

class ProductManager {
  constructor(fileName) {
    this.path = fileName;

    (async () => {
      await fs.promises.readFile(`./${this.path}`, 'utf-8')
        .then(async (content) => {
          content = JSON.parse(content);
          if (!content.maxElements && content.maxElements !== 0) {
            const data = [];
            const maxElements = 0;
            const content = { maxElements: maxElements, data: data }
            await fs.promises.writeFile(`./${this.path}`, JSON.stringify(content));
            console.error("Corrupted file. Generate new one")
          }
        })
        .catch(async (error) => {
          const data = [];
          const maxElements = 0;
          const content = { maxElements: maxElements, data: data }
          await fs.promises.writeFile(`./${this.path}`, JSON.stringify(content));
          console.error('FileCreation: ', error)
        });
    })();
  }

  // Verifica que no existan items null ni undefined
  checkNull = (element, keys) => {
    return keys.every((key) => element[key]);
  }

  // Chequea que no exista un producto con ese codigo antes de agregarse al listado
  checkDuplicateCode(code, allProduct) {
    const findProduct = allProduct.find(prod => prod.code === code);
    if (findProduct) {
      return false;
    } else {
      return true;
    }
  }

  // Retorna el listado de productos
  async getProducts(limit) {
    try {
      const content = JSON.parse(await fs.promises.readFile(`./${this.path}`, 'utf-8'));
      if(limit) {
        let limitedArray = content.data.slice(0, limit);
        return limitedArray;
      } else {
        return content.data;
      }
    } catch (error) {
      console.error("getProducts: ", error);
    }
  }

  // Consulta si el producto existe segun id
  async getProductById(id) {
    try {
      const content = JSON.parse(await fs.promises.readFile(`./${this.path}`, 'utf-8'));
      const findProduct = content.data.find(prod => prod.id === Number(id));
      if (findProduct) {
        return findProduct;
      } else {
        return "Not found";
      }
    } catch (error) {
      console.error('getProductById: ', error);
    }
  }

  // Agrega productos al listado
  async addProduct(object) {
    let { code } = object;
    let content = JSON.parse(await fs.promises.readFile(`./${this.path}`, 'utf-8'));

    const itemNotNull = this.checkNull(object, Object.keys(object));
    const itemNotExist = this.checkDuplicateCode(code, content.data);

    if (itemNotNull && itemNotExist) {
      try {
        const newID = content.maxElements + 1;
        object.id = newID;
        content.maxElements = newID;
        content.data = [...content.data, object];
        await fs.promises.writeFile(`./${this.path}`, JSON.stringify(content));
        return newID;
      } catch (error) {
        console.log('addProduct: ', error);
      }
    } else {
      if (!itemNotNull) {
        console.log('Missing info on product');
      } else {
        console.log('Product already exist');
      }
    }
  }

  async updateProduct(ID, toUpdate) {
    try {
      if (toUpdate.id) {
        toUpdate = { ...toUpdate, id: ID };
      }
      let content = JSON.parse(await fs.promises.readFile(`./${this.path}`, 'utf-8'));
      //File options
      const currentID = content.maxElements
      const allProduct = content.data;

      const updatedData = allProduct.map(item => (item.id === ID ? { ...item, ...toUpdate } : item));
      content.maxElements = currentID;
      content.data = updatedData;
      await fs.promises.writeFile(`./${this.path}`, JSON.stringify(content));

    } catch (error) {
      console.error('updateProduct: ', error);
    }
  }


  // Elimina el producto segun id, si no existe lanza advertencia
  async deleteProduct(id) {
    try {
      let content = JSON.parse(await fs.promises.readFile(`./${this.path}`, 'utf-8'));
      const allProduct = content.data;

      const findProduct = allProduct.find(prod => prod.id === id);
      if (findProduct) {
        allProduct.splice(findProduct, 1);
        await fs.promises.writeFile(`./${this.path}`, JSON.stringify(content));
        return {
          code: 200,
          message: `Product ${id} deleted.`
        };
      } else {
        return {
          code: 404,
          message: `Product ${id} not found.`
        };
      }
    } catch (error) {
      return error;
    }
  }
}

module.exports = ProductManager;
