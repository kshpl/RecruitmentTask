import React, { Component } from 'react';
import './App.css';

const incomesAPI = 'https://recruitment.hal.skygate.io/incomes/';
class App extends Component {

  state = {
    rows: 20,
    loading: true,
    sorted: 'none',
    headers: [
      { value: 'ID' },
      { value: 'Name' },
      { value: 'City' },
      { value: 'Total Income' },
      { value: 'Average Income' },
      { value: 'Last Month Income' },
    ],
    companiesIds: [],
    companiesNames: [],
    companiesCities: [],
    companiesIncomes: {
      totalIncomes: [],
      averageIncomes: [],
      lastMonthIncomes: [],
    },
    companiesIncomesOriginals: {
      totalIncomesOriginals: [],
      averageIncomesOriginals: [],
      lastMonthIncomesOriginals: [],
    },
    finalData: [],
    id: 205,
    index: 0,
    dataIndex: 0,
  }


  async componentDidMount() {
    const getCompaniesNames = async () => {
      try {
        const companiesDetails = 'https://recruitment.hal.skygate.io/companies';
        const detailsResponse = await fetch(companiesDetails);
        const detailsData = detailsResponse.json().then(detailsData => {
          const idDetails = detailsData.map((company, index) => company.id)
          const nameDetails = detailsData.map((company, index) => company.name)
          const cityDetails = detailsData.map((company, index) => company.city)

          const idSorted = detailsData.map((company, index) => company.id).sort();
          const idSortedReverse = detailsData.map((company, index) => company.id).sort().reverse();

          const nameSorted = detailsData.map((company, index) => company.name).sort();
          const nameSortedReverse = detailsData.map((company, index) => company.name).sort().reverse();

          const citySorted = detailsData.map((company, index) => company.city).sort();
          const citySortedReverse = detailsData.map((company, index) => company.city).sort().reverse();
          this.setState({

            finalData: detailsData,
            companiesNames: nameDetails,
            companiesIds: idDetails,
            companiesCities: cityDetails,
            id: idDetails[this.state.index],
            companiesIdsSorted: idSorted,
            companiesNamesSorted: nameSorted,
            companiesCitiesSorted: citySorted,
            companiesIdsSortedReverse: idSortedReverse,
            companiesNamesSortedReverse: nameSortedReverse,
            companiesCitiesSortedReverse: citySortedReverse,
            originalsNames: nameDetails,
            originalsIds: idDetails,
            originalsCities: cityDetails,

          })


        })




        this.setState({
          loading: false,
        })

        return detailsData
      } catch (err) {
        console.log(err)
      }
    }
    const getCompaniesIncomes = async (id) => {
      try {
        const incomesResponse = await fetch(`${incomesAPI}${id}`);
        const incomesData = incomesResponse.json().then(incomesData => {
          const newIncomes = [...incomesData.incomes];

          const summed = incomesData.incomes.map((income, index) => parseInt(income.value)).reduce((a, b) => a + b, 0);

          const averageLength = incomesData.incomes.map((income, index) => parseInt(income.value)).length;

          const average = summed / averageLength;

          const lastMonthValidation = newIncomes.map((company, index) => (company.date.match(/-12-/) ? company.value : 0));
          const lastMonthParse = lastMonthValidation.map(deal => parseInt(deal));
          const lastmonthSum = lastMonthParse.reduce((a, b) => a + b, 0);

          return (
            this.state.companiesIncomes.totalIncomes.push(summed),
            this.state.companiesIncomesOriginals.totalIncomesOriginals.push(summed),
            this.state.companiesIncomes.averageIncomes.push(average),
            this.state.companiesIncomesOriginals.averageIncomesOriginals.push(average),
            this.state.companiesIncomes.lastMonthIncomes.push(lastmonthSum),
            this.state.companiesIncomesOriginals.lastMonthIncomesOriginals.push(lastmonthSum)

          )
        })




        return incomesData
      } catch (err) {
        console.log(err)
      }
    }

    setInterval(() => {
      if (this.state.index < this.state.companiesIds.length) {
        getCompaniesIncomes(this.state.id)
        this.setState({
          id: this.state.companiesIds[this.state.index],
          index: this.state.index + 1
        })
      }
    }, 0)

    getCompaniesNames()





  }




  getHeaders = () => {
    const headers = this.state.headers.map((header, index) => <th key={index} sorted={this.state.sorted} onClick={this.handleSort} className='table_header'>{header.value}</th>)
    return headers
  }
  handleNextPage = () => {
    if (this.state.dataIndex < this.state.companiesIds.length - 20) {
      this.setState({
        dataIndex: this.state.dataIndex + 20,
      })
    }
  }
  handlePreviousPage = () => {
    if (this.state.dataIndex > 0) {
      this.setState({
        dataIndex: this.state.dataIndex - 20,
      })
    }
  }
  handleSort = () => {

    if (this.state.sorted === 'none') {
      this.setState({
        sorted: 'asc',

        companiesIds: this.state.companiesIdsSorted,
        companiesNames: this.state.companiesNamesSorted,
        companiesCities: this.state.companiesCitiesSorted,
        companiesIncomes: {
          totalIncomes: this.state.companiesIncomes.totalIncomes.splice(0).sort(),
          averageIncomes: this.state.companiesIncomes.averageIncomes.splice(0).sort(),
          lastMonthIncomes: this.state.companiesIncomes.lastMonthIncomes.splice(0).sort()
        }

      })
    }
    else if (this.state.sorted === 'asc') {
      this.setState({
        sorted: 'desc',
        companiesNames: this.state.companiesNamesSortedReverse,
        companiesIds: this.state.companiesIdsSortedReverse,
        companiesCities: this.state.companiesCitiesSortedReverse,
        companiesIncomes: {
          totalIncomes: this.state.companiesIncomes.totalIncomes.splice(0).sort().reverse(),
          averageIncomes: this.state.companiesIncomes.averageIncomes.splice(0).sort().reverse(),
          lastMonthIncomes: this.state.companiesIncomes.lastMonthIncomes.splice(0).sort().reverse()
        }

      })

    }
    else if (this.state.sorted === 'desc') {
      this.setState(({
        sorted: 'none',
        companiesIds: this.state.originalsIds,
        companiesNames: this.state.originalsNames,
        companiesCities: this.state.originalsCities,
        companiesIncomes: {
          totalIncomes: this.state.companiesIncomesOriginals.totalIncomesOriginals,
          averageIncomes: this.state.companiesIncomesOriginals.averageIncomesOriginals,
          lastMonthIncomes: this.state.companiesIncomesOriginals.lastMonthIncomesOriginals
        }
      }))
    }



  }

  render() {

    return (

      <div>

        {this.state.loading ?
          <div className='loadingText'>Loading datas...</div> :
          <div className='headerText'>Recruitment Task - Table of Companies details and incomes. </div>}

        <input type="text" className='filterInput' />
        <div className='tableSwitchers'>

          <button className="button nextPage" onClick={this.handleNextPage}> &rarr; </button>
          <button className="button previousPage" onClick={this.handlePreviousPage}>&larr;</button>
        </div>
        <table className='table'>
          <thead>
            <tr className='table_row'>
              {this.getHeaders()}
            </tr>
          </thead>
          <tbody>
            {(this.state.finalData.length > 0) ? this.state.finalData.map((data, index) => {
              if (index < 20) {
                return (
                  <tr key={index} data={`${this.state.companiesIds[this.state.dataIndex + index]} | ${this.state.companiesNames[this.state.dataIndex + index]} | ${this.state.companiesCities[this.state.dataIndex + index]} | ${this.state.companiesIncomes.totalIncomes[this.state.dataIndex + index]}| ${this.state.companiesIncomes.averageIncomes[this.state.dataIndex + index]} | ${this.state.companiesIncomes.lastMonthIncomes[this.state.dataIndex + index]}`} className='table_row'>
                    <td className='table_data'> {this.state.companiesIds[this.state.dataIndex + index]}</td>
                    <td className='table_data'>{this.state.companiesNames[this.state.dataIndex + index]}</td>
                    <td className='table_data'>{this.state.companiesCities[this.state.dataIndex + index]}</td>
                    <td className='table_data'>{this.state.companiesIncomes.totalIncomes[this.state.dataIndex + index]}</td>
                    <td className='table_data'>{this.state.companiesIncomes.averageIncomes[this.state.dataIndex + index]}</td>
                    <td className='table_data'>{this.state.companiesIncomes.lastMonthIncomes[this.state.dataIndex + index]}</td>
                  </tr>
                )
              }
            })
              : <tr><td className='table_data'>Loading...</td></tr>}



          </tbody>
        </table>


      </div >



    );
  }
}

export default App;