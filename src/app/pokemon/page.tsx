'use client';
import { getListPokemonAbility, getPokemonList } from '@/apis/pokemon.api';
import {
  getLanguageEffect,
  getLatestFlavorText,
  formatName,
} from '@/utils/pokemonUtils';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Descriptions,
  Divider,
  List,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useState } from 'react';

const { Title, Text, Paragraph } = Typography;

const Pokemon = () => {
  const [selectedUrl, setSelectedUrl] = useState(
    'https://pokeapi.co/api/v2/ability/1'
  );

  const { data: listAbility } = useQuery({
    queryKey: ['list-ability'],
    queryFn: () => getListPokemonAbility(),
  });

  const {
    data: abilityData,
    error,
    refetch,
  } = useQuery({
    queryKey: ['pokemon-ability', selectedUrl],
    queryFn: () => getPokemonList(selectedUrl),
    enabled: selectedUrl !== '',
  });

  const handleSelectedUrl = (url: string) => {
    setSelectedUrl(url);
  };

  const ability = abilityData;
  const englishEffect = getLanguageEffect(ability?.effect_entries || []);
  const latestFlavorText = getLatestFlavorText(
    ability?.flavor_text_entries || []
  );

  const errorCard = () => (
    <Card
      title='Error Loading Ability'
      className='max-w-3xl mx-auto my-5'
      extra={
        <button
          onClick={() => refetch()}
          className='px-3 py-1.5 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-600'
        >
          Retry
        </button>
      }
    >
      <Text type='danger'>Failed to load ability data: {error?.message}</Text>
    </Card>
  );

  return (
    <div className='max-w-3xl mx-auto my-5 px-4 '>
      {error && errorCard()}
      <Card
        title={
          <Space align='center'>
            <Title level={2} className='!m-0 capitalize'>
              {ability?.name?.replace('-', ' ')}
            </Title>
            <Tag color='blue'>ID: {ability?.id}</Tag>
            <Tag color='green'>
              {ability?.generation?.name?.replace('-', ' ')}
            </Tag>
          </Space>
        }
        className='mb-4'
      >
        <Space direction='vertical' size='large' className='w-full'>
          {englishEffect?.short_effect && (
            <div>
              <Title level={4}>Quick Summary</Title>
              <Text strong className='text-base text-blue-500'>
                {englishEffect.short_effect}
              </Text>
            </div>
          )}

          {englishEffect?.effect && (
            <div>
              <Title level={4}>Detailed Effect</Title>
              <Paragraph className='bg-gray-100 p-3 rounded-md'>
                {englishEffect.effect
                  .split('\n')
                  .map((line: any, index: any) => (
                    <div key={index} className={line.trim() ? 'mb-2' : 'mb-1'}>
                      {line || <br />}
                    </div>
                  ))}
              </Paragraph>
            </div>
          )}

          {latestFlavorText?.flavor_text && (
            <div>
              <Title level={4}>In-Game Description</Title>
              <Text italic className='text-sm'>
                "{latestFlavorText.flavor_text}"
              </Text>
              <br />
              <Text type='secondary' className='text-xs'>
                From {latestFlavorText.version_group?.name?.replace('-', ' ')}
              </Text>
            </div>
          )}

          <Divider />

          <div>
            <Title level={4}>Pokémon with this Ability</Title>
            <List
              grid={{ gutter: 8, xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
              dataSource={ability?.pokemon || []}
              renderItem={(pokemon: any) => (
                <List.Item>
                  <Card
                    size='small'
                    hoverable
                    className='text-center py-2 px-1'
                  >
                    <Text strong className='capitalize'>
                      {pokemon?.pokemon.name}
                    </Text>
                    <br />
                    <Tag
                      color={pokemon.is_hidden ? 'orange' : 'green'}
                      className='mt-1'
                    >
                      {pokemon.is_hidden ? 'Hidden' : 'Normal'}
                    </Tag>
                  </Card>
                </List.Item>
              )}
            />
          </div>

          <Descriptions
            title='Additional Information'
            bordered
            column={1}
            size='small'
          >
            <Descriptions.Item label='Total Pokémon'>
              {ability?.pokemon?.length || 0}
            </Descriptions.Item>
            <Descriptions.Item label='Hidden Ability Users'>
              {ability?.pokemon?.filter((p: any) => p.is_hidden).length || 0}
            </Descriptions.Item>
            <Descriptions.Item label='Normal Ability Users'>
              {ability?.pokemon?.filter((p: any) => !p.is_hidden).length || 0}
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </Card>
      {listAbility && (
        <Card title='Available Abilities' className='mt-4'>
          <h2 className='text-red-500'>please select an ability</h2>
          <div className='max-h-50 overflow-y-auto'>
            {listAbility.results?.map((item, index: number) => (
              <p
                key={index}
                className='my-1 cursor-pointer hover:text-blue-500'
                onClick={() => handleSelectedUrl(item.url)}
              >
                {formatName(item.name)}
              </p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Pokemon;
