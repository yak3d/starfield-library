import { graphql, useStaticQuery } from 'gatsby'
import React, { useEffect, useState } from 'react'
import * as JsSearch from 'js-search'
import { Input, Table } from 'react-daisyui'

export const SearchContainer = () => {
    const gqlResults: GatsbyTypes.SfBooksSearchQuery = useStaticQuery(graphql`
    query SfBooksSearch {
        allSfBooksJson {
            edges {
                node {
                    editorId,
                    bookTitle,
                    bookText
                }
            }
        }
    }`)

    const data = gqlResults.allSfBooksJson.edges.map(edge => edge.node)

    console.log(data)
    const [bookList, setBookList] = useState<{
        readonly editorId: string | null
        readonly bookTitle: string | null
        readonly bookText: string | null;
    }[]>(data)
    const [search, setSearch] = useState<JsSearch.Search>()
    const [searchResults, setSearchResults] = useState<{
        readonly editorId: string | null
        readonly bookTitle: string | null
        readonly bookText: string | null;
    }[]>(data)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        setBookList(data)
        rebuildIndex()
    }, [])

    const rebuildIndex = () => {
        const dataToSearch = new JsSearch.Search("editorId")
        /**
         * defines an indexing strategy for the data
         * more about it in here https://github.com/bvaughn/js-search#configuring-the-index-strategy
         */
        dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy()
        /**
         * defines the sanitizer for the search
         * to prevent some of the words from being excluded
         *
         */
        dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer()
        /**
         * defines the search index
         * read more in here https://github.com/bvaughn/js-search#configuring-the-search-index
         */
        dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex("editorId")

        dataToSearch.addIndex("bookTitle") // sets the index attribute for the data
        dataToSearch.addIndex("bookText") // sets the index attribute for the data

        dataToSearch.addDocuments(bookList) // adds the data to be searched
        setSearch(dataToSearch)
        setIsLoading(false)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault()

    const searchData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const queryResult = search?.search(e.target.value)
        setSearchQuery(e.target.value)

        if (queryResult != null) {
            setSearchResults(queryResult)
        }
    }

    return (
        <>
            <div className='container mx-auto'>
                <div style={{ margin: "0 auto" }}>
                    <form onSubmit={handleSubmit}>
                        <div className='form-control w-full max-w-xs'>
                            <div className='label'>
                                <label htmlFor="Search" className='label-text'>
                                    Enter your search here
                                </label>
                            </div>
                            <Input
                                id="Search"
                                value={searchQuery}
                                onChange={searchData}
                                placeholder="Enter your search here"
                            />
                        </div>
                    </form>
                    <div>
                        Number of items:
                        {searchResults.length}
                        <Table>
                            <Table.Head>
                                <span>Editor ID</span>
                                <span>Slate Name</span>
                                <span>Slate Text</span>
                            </Table.Head>
                            <Table.Body>
                                {searchResults.map(item => {
                                    return (
                                        <Table.Row key={`row_${item.editorId}`}>
                                            <span>{item.editorId}</span>
                                            <span>{item.bookTitle}</span>
                                            <span>{item.bookText}</span>
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    )

}