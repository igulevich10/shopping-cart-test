import React, {useState} from 'react';
import { Button, DataTable, AlphaStack, Select, TextField  } from '@shopify/polaris'; 
import './styles.scss';
import "@shopify/polaris/build/esm/styles.css";

/**Union of strings representing the supported currencies */
type Currency = 'USD' | 'EUR' | 'JPY';

/**Shape of each item in the cart */
interface ICartItemProps {
  name: string;
  quantity: number;
  currency: Currency;
}

const Cart = () => {
  /**Managing the cart state */
  const [total, setTotal] = useState<string>('0.00');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [cart, setCart] = useState<ICartItemProps[]>([
    {
      name: '', 
      quantity: 0,
      currency: selectedCurrency
    },
  ]);
  
  /**Function handleAddItem adds a new empty CartItem when the user clicks AddItem button */
  const handleAddItem = (): void => {
    setCart([...cart, {
      name: '', 
      quantity: 0,
      currency: selectedCurrency
    }]);
  };

  /**Function updateCartItem updates CartItem when the user enters a value in fields */
  const updateCartItem = (index: number, field: keyof ICartItemProps, value: string | number | Currency): void => {
    const updatedCart = [...cart];
    updatedCart[index][field] = value as never;
    setCart(updatedCart);
  };

  /**Function calculateTotal iterates each item and calculates total cost */
  const calculateTotal = (): string => {
    let runningTotal = 0;
    for (let i = 0; i <cart.length; i++) {
      const {quantity, currency} = cart[i];
      let rate = 1;
      // instead of api
      switch (currency) {
        case 'EUR':
          rate = 0.91;
          break;
        case 'JPY':
          rate = 132.87;
          break;
        default: 
        // USD rate is 1
          break;
      }
      const value = quantity*rate;
      runningTotal += value;
    }
    const formattedTotal = runningTotal.toLocaleString('en-us', {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setTotal(formattedTotal);
    return formattedTotal;
  };

  /**Function handleSave creates a payload object and logs in console */
  const handleSave = () => {
    const payload = {
      total: calculateTotal(),
      cart: cart,
    };
    console.log(payload);
  };

  /**Array currencyOptions */
  const currencyOptions = [
    {label: 'USD', value: 'USD'},
    {label: 'EUR', value: 'EUR'},
    {label: 'JPY', value: 'JPY'},
  ];

  /**Render a shopping cart with a table displaying the items, their qty and currencies, and total */
  return (
    <div className="cart">
      <h1 className="cart-title">Shopping Cart</h1>
      <DataTable 
        columnContentTypes={['text', 'numeric', 'text']}
        headings={['PRODUCT NAME', 'QUANTITY', 'CURRENCY']}
        rows={cart.map((item, index) => [
          <TextField 
            label=""
            value={item.name}
            onChange={(value) => updateCartItem(index, 'name', value)}
            autoComplete="off"
          />,
          <TextField 
            label=""
            type="number"
            value={item.quantity.toString()}
            onChange={(value) => updateCartItem(index, 'quantity', Number(value))}
            autoComplete="off"
          />,
          <Select 
            label=""
            options={currencyOptions}
            value={item.currency}
            onChange={(value) => updateCartItem(index, 'currency', value as Currency)}
          />
        ])}/>
        
        <Button onClick={handleAddItem}>Add Item</Button>
        <AlphaStack>
          <Select 
            label="Final Currency"
            options={currencyOptions}
            value={selectedCurrency}
            onChange={(value) => setSelectedCurrency(value as Currency)}
          />
        </AlphaStack>
        <AlphaStack>
          <h4 className="cart-total-title">Total:</h4>
          <span className="cart-total">{total}</span>
        </AlphaStack>
        <Button primary onClick={handleSave}>Save</Button>
    </div>
  )
};

export default Cart;