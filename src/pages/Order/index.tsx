import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal, 
  FlatList
} from "react-native";
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { api } from "../../services/api";
import { ModalPicker } from "../../components/ModalPicker";
import { ListItem } from "../../components/ListItem";

type RouteDetailParams = {
  Order: {
    number: number | string;
    order_id: string;
  }
}

export type CategoryProps = {
  id: string;
  name: string;
}

type ProductProps = {
  id: string;
  name: string;
}

type ItemProps = {
  id: string;
  product_id: string;
  name: string;
  amount: string | number;
}

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>

export default function Order() {
  const route = useRoute<OrderRouteProps>()
  const navigation = useNavigation()

  const [category, setCategory] = useState<CategoryProps[] | []>([])
  const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>()
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false)

  const [products, setProducts] = useState<ProductProps[] | []>([])
  const [productSelected, setProductSelected] = useState<ProductProps | undefined>()
  const [modalProductVisible, setModalProductVisible] = useState(false)

  const [amount, setAmount] = useState('1')
  const [items, setItems] = useState<ItemProps[] | []>([])

  //Quando a tela for montada ele vai fazer a requisição para buscar as categorias
  useEffect(() => {
    async function loadInfo() {
      const response = await api.get('/categories')
      setCategory(response.data)
      setCategorySelected(response.data[0])
    }
    loadInfo()
  }, [])

  //Quando a categoria selecionada mudar ele vai fazer a requisição para buscar os produtos
  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('/category/product', {
        params: {
          category_id: categorySelected?.id
        }
      })
      setProducts(response.data)
      setProductSelected(response.data[0])
    }
    loadProducts()
  }, [categorySelected])

  async function handleCloseOrder() {
    try {
      await api.delete('/order', {
        params: {
          order_id: route.params?.order_id
        }
      })
      navigation.goBack()
    } catch (error) {
      console.log(error)
    }
  }

  function handleChangeCategory(item: CategoryProps) {
    setCategorySelected(item)
  }

  function handleChangeProduct(item: ProductProps) {
    setProductSelected(item)
  }

  async function handleAdd() {
    console.log('CLICOU')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesa: {route.params.number}</Text>
        <TouchableOpacity onPress={handleCloseOrder}>
          <Feather name="trash-2" size={28} color="#FF3F4b" />
        </TouchableOpacity>
      </View>

      {category.length !== 0 && (
        <TouchableOpacity style={styles.input} onPress={() => setModalCategoryVisible(true)}>
          <Text style={{ color: '#FFF' }}>
            {categorySelected?.name}
          </Text>
        </TouchableOpacity>
      )}

      {products.length !== 0 && (
        <TouchableOpacity style={styles.input} onPress={ () => setModalProductVisible(true)}>
          <Text style={{ color: '#FFF' }}>
            {productSelected?.name}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.qtdContainer}>
        <Text style={styles.qtdText}>Quantidade</Text>
        <TextInput
          style={[styles.input, { width: '60%', textAlign: 'center' }]}
          placeholderTextColor="#F0F0F0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, {opacity: items.length === 0 ? 0.3 : 1}]}
          disabled={items.length === 0}
        >
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: 24 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={ ({item}) => <ListItem data={item} /> }
      />

      <Modal
        transparent={true}
        visible={modalCategoryVisible}
        animationType="fade"
      >
        <ModalPicker
          handleCloseModal={() => setModalCategoryVisible(false)}
          options={category}
          selectedItem={ handleChangeCategory }
        />
      </Modal>

      <Modal
        transparent={true}
        visible={modalProductVisible}
        animationType="fade"
      >
        <ModalPicker
          handleCloseModal={() => setModalProductVisible(false)}
          options={products}
          selectedItem={ handleChangeProduct }
        />
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d2e',
    paddingVertical: '5%',
    paddingEnd: '4%',
    paddingStart: '4%'
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    marginRight: 14
  },
  input: {
    backgroundColor: '#101026',
    borderRadius: 4,
    width: '100%',
    height: 40,
    marginBottom: 12,
    justifyContent: 'center',
    paddingHorizontal: 8,
    color: '#FFF',
    fontSize: 20
  },
  qtdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  qtdText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  buttonAdd: {
    width: '20%',
    backgroundColor: '#3fd1ff',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#101026',
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#3fffa3',
    borderRadius: 4,
    height: 40,
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});