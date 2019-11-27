import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchFormComponent from '../components/SearchForm';
import { getCategories, getMaterials } from '../services/PatternApi';

export default class SearchForm extends Component {
  constructor(props) {
    super(props);
    const { defaultName } = this.props;
    this.state = {
      name: defaultName,
      category: 'all',
      selectedMaterials: [],
      sorting: 'recent',
      nextCategory: 'all',
      nextMaterials: [],
      nextSorting: 'recent',
      categories: [],
      materials: [],
      options: [{ name: 'Más Reciente', value: 'recent' },
        { name: 'Más Popular', value: 'popular' },
        { name: 'Mejor Valorado', value: 'rating' }],
    };
    this.mounted = false;

    this.onQueryText = this.onQueryText.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.onSortingChange = this.onSortingChange.bind(this);
    this.onMaterialsChange = this.onMaterialsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
    this.loadMaterials = this.loadMaterials.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    const { onRefreshPatterns } = this.props;
    this.loadCategories();
    this.loadMaterials();
    const {
      name, category, selectedMaterials, sorting,
    } = this.state;
    onRefreshPatterns({
      name, category, materials: selectedMaterials, sorting,
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async onQueryText(event) {
    const { onRefreshPatterns } = this.props;
    const { category, selectedMaterials, sorting } = this.state;
    const name = event.target.value;
    this.setState({ name });
    onRefreshPatterns({
      name, category, materials: selectedMaterials, sorting,
    });
  }

  onCategoryChange(event) {
    const category = event.target.value;
    this.setState({ nextCategory: category });
  }

  onSortingChange(event) {
    const sorting = event.target.value;
    this.setState({ nextSorting: sorting });
  }

  onMaterialsChange(event) {
    const { nextMaterials } = this.state;
    const material = event.target.value;
    if (event.target.checked) {
      nextMaterials.push(material);
    } else {
      nextMaterials.splice(nextMaterials.indexOf(material), 1);
    }
    this.setState({ nextMaterials });
  }

  async loadCategories() {
    const categories = await getCategories();
    if (this.mounted) {
      this.setState({ categories });
    }
  }

  async loadMaterials() {
    const materials = await getMaterials();
    if (this.mounted) {
      this.setState({ materials });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { onRefreshPatterns } = this.props;
    const {
      nextCategory, nextMaterials, nextSorting,
    } = this.state;
    this.setState({
      category: nextCategory, selectedMaterials: nextMaterials, sorting: nextSorting,
    });
    const { name } = this.state;
    onRefreshPatterns({
      name, category: nextCategory, materials: nextMaterials, sorting: nextSorting,
    });
  }

  render() {
    const {
      name, categories, materials, options,
    } = this.state;
    return (
      <SearchFormComponent
        onQueryText={this.onQueryText}
        onSubmit={this.handleSubmit}
        onCategoryChange={this.onCategoryChange}
        onCheck={this.onMaterialsChange}
        onSort={this.onSortingChange}
        name={name}
        categories={categories}
        materials={materials}
        options={options}
      />
    );
  }
}

SearchForm.propTypes = {
  onRefreshPatterns: PropTypes.func.isRequired,
  defaultName: PropTypes.string.isRequired,
};
