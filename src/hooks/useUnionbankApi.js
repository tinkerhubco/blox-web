import { useState, useEffect } from 'react';
import { createApi } from '@synvox/api';
import axios from 'axios';
import qs from 'querystring';

const unionBankAxios = axios.create({
  baseURL: process.env.REACT_APP_UNIONBANK_BASE_URL,
});

const { useApi: useUnionbankApi } = createApi(unionBankAxios);

export const useUnionbankGetAccessToken = code => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async () => {
    setLoading(false);

    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.REACT_APP_UNIONBANK_CLIENT_ID,
      code,
      redirect_uri: process.env.REACT_APP_UNIONBANK_REDIRECT_URI,
    });

    try {
      const response = await unionBankAxios.post(
        '/convergent/v1/oauth2/token',
        body,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'text/html',
            'x-ibm-client-id': process.env.REACT_APP_UNIONBANK_CLIENT_ID,
            'x-ibm-client-secret':
              process.env.REACT_APP_UNIONBANK_CLIENT_SECRET,
          },
        },
      );
      setData(response);
      setLoading(false);
      return data;
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  if (!code) {
    setError('No code specified');
  }
  return {
    execute,
    data,
    error,
    loading,
  };
};

export const useUnionbankFundTransfer = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const execute = async () => {
      try {
        setLoading(true);
        const response = await unionBankAxios.post(
          '/partners/v1/transfers/single',
          {
            senderTransferId: 'TRANSFER-0001',
            transferRequestDate: '2017-10-10T12:11:50Z',
            accountNo: '0001',
            amount: {
              currency: 'PHP',
              value: '100',
            },
            remarks: 'Transfer remarks',
            particualtrs: 'Transfer particulars',
            info: [
              {
                index: 1,
                name: 'Recipient',
                value: 'Juan Dela Cruz',
              },
              {
                index: 2,
                name: 'Message',
                value: 'Happy Investment',
              },
            ],
          },
        );
        setLoading(false);
        setData(response);
        return response;
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    execute();
  }, [error, loading, data]);

  return {
    error,
    loading,
    data,
  };
};

export { useUnionbankApi };
