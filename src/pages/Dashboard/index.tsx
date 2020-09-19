// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  // eslint-disable-next-line camelcase
  full_name: string;
  description: string;
  owner: {
    login: string;
    // eslint-disable-next-line camelcase
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');
    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }
    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Error na busca por esse repositório');
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input value={newRepo} onChange={e => setNewRepo(e.target.value)} placeholder="Digite o Nome do repositório" />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(respository => (
          <Link key={respository.full_name} to={`/repositories/${respository.full_name}`}>
            <img src={respository.owner.avatar_url} alt={respository.owner.login} />
            <div>
              <strong>{respository.full_name}</strong>
              <p>{respository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
