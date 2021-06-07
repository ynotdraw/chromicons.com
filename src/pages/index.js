import { CategoryFilters } from '../components/categoryFilters';
import { Chromicons } from '../components/icons/chromicons';
import { IconModal } from '../components/iconModal';
import { LifeOmic } from '../components/icons/lifeomic';
import { SearchField } from '../components/searchField';
import { Tile } from '../components/tile';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Transition } from '@tailwindui/react';
import { useState } from 'react';
import { CheckCircle, Download, Flag, Lifeology } from '@lifeomic/chromicons';
import * as allLinedChromicons from '@lifeomic/chromicons';
import clsx from 'clsx';
import Head from 'next/head';
import metadata from '../util/metadata';
import Link from 'next/link';

const getChromicons = () => {
  const iconNames = Object.keys(allLinedChromicons);

  return iconNames?.map((icon) => {
    return {
      name: icon.replace(
        /[A-Z]+(?![a-z])|[A-Z]|\d+/g,
        (value, separator) => (separator ? '-' : '') + value.toLowerCase()
      ),
      rawName: icon,
      keywords: metadata[icon]?.keywords,
      categories: metadata[icon]?.categories,
      reactComponent: allLinedChromicons[icon],
    };
  });
};

export function getStaticProps() {
  return {
    props: { pkgVersion: require('@lifeomic/chromicons/package.json').version },
  };
}

export default function IndexPage({ pkgVersion }) {
  const [iconInView, setIconInView] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchText, setSearchText] = useState('');

  const [visibleIcons, setVisibleIcons] = useState(() => getChromicons('all'));

  return (
    <>
      <IconModal icon={iconInView} onDismiss={() => setIconInView(null)} />

      <header
        className="mb-16"
        style={{
          background: '#fff',
        }}
      >
        <Header pkgVersion={pkgVersion} />
      </header>

      <main className="bg-white text-gray-600 flex flex-1 flex-col scrolling-touch -mt-12 w-3/4 m-auto">
        <div className="flex sm:flex-col xl:flex-row font-hero relative mb-16">
          <div style={{ zIndex: '999' }}>
            <h1 className="text-black text-2xl leading-9 font-bold sm:text-4xl sm:leading-10 uppercase">
              Handcrafted open source icons
            </h1>
            <p className="text-black max-w-lg text-sm sm:text-base pt-5 pb-5">
              Ready to use in web, iOS, Android, and desktop apps. Support for
              SVG and web font. Completely open source, MIT licensed, and built
              with
              <span className="text-red-600" role="img">
                {' '}
                ♥️{' '}
              </span>
              by the team at LifeOmic.
            </p>
            <dl className="flex flex-wrap whitespace-no-wrap text-xs font-bold leading-5 sm:text-sm">
              <div className="flex items-center mx-3 space-x-2 text-orange-400 sm:mx-4 xl:ml-0 xl:mr-8">
                <dt>
                  <Lifeology className="h-6 w-6" role="img" aria-hidden />
                </dt>
                <dd className="uppercase">
                  {Object.keys(allLinedChromicons).length} icons
                </dd>
              </div>
              <div className="flex items-center mx-3 space-x-2 text-teal-300 sm:mx-4 xl:ml-0 xl:mr-8">
                <dt>
                  <CheckCircle className="h-6 w-6" role="img" aria-hidden />
                </dt>
                <dd className="uppercase">MIT Licensed</dd>
              </div>
              <div className="flex items-center mx-3 space-x-2 text-purple-400 sm:mx-4 xl:ml-0 xl:mr-8">
                <dt>
                  <Flag className="h-6 w-6" role="img" aria-hidden />
                </dt>
                <dd className="uppercase">Version {pkgVersion}</dd>
              </div>
            </dl>
          </div>
          <div>
            <img
              src={`${process.env.BACKEND_URL}/big-icon.png`}
              className="absolute"
              alt="home banner"
              style={{
                bottom: -16,
                right: -5,
                top: -75,
              }}
            />
          </div>
        </div>

        <div
          className="lg:flex md:flex sm:flex justify-between items-start shadow-banner px-4 lg:flex-row sm:flex-col sm:px-6 lg:px-6 bg-white"
          style={{ zIndex: '9999' }}
        >
          <CategoryFilters
            className="-mt-4"
            selectedTab={selectedTab}
            onChange={(filter) => {
              setSelectedTab(filter);
              setSearchText('');

              if (filter === 'all') {
                setVisibleIcons(getChromicons());
                return;
              }

              if (filter === 'ui') {
                setVisibleIcons(
                  getChromicons()?.filter((icon) =>
                    icon?.categories?.includes('ui')
                  )
                );
                return;
              }

              if (filter === 'science') {
                setVisibleIcons(
                  getChromicons()?.filter((icon) =>
                    icon?.categories?.includes('science')
                  )
                );
                return;
              }

              if (filter === 'health') {
                setVisibleIcons(
                  getChromicons()?.filter((icon) =>
                    icon?.categories?.includes('health')
                  )
                );
                return;
              }
            }}
          />
          <div className="pb-6">
            <SearchField
              className="pt-6 w-full sm:px-6 md:px-0 md:mb-0"
              inputClassName="w-full"
              value={searchText}
              onChange={(e) => {
                const search = e.target.value;

                setSearchText(e.target.value);

                const filteredIcons =
                  selectedTab !== 'all'
                    ? getChromicons()?.filter((icon) =>
                        icon?.categories?.includes(selectedTab)
                      )
                    : getChromicons();

                if (!search) {
                  setVisibleIcons(filteredIcons);
                  return;
                }

                setVisibleIcons(
                  filteredIcons?.filter(
                    (icon) =>
                      icon.rawName
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                      icon.name?.toLowerCase().includes(search.toLowerCase()) ||
                      icon?.keywords
                        ?.toLowerCase()
                        ?.includes(search.toLowerCase())
                  )
                );
              }}
            />
          </div>
        </div>
        {visibleIcons?.length > 0 ? (
          <div
            className="flex flex-wrap justify-center mx-auto bg-white"
            style={{ zIndex: '9999' }}
          >
            {visibleIcons?.map((icon) => {
              const Icon = icon.reactComponent;
              return (
                <Tile
                  name={icon.name}
                  key={icon.name}
                  isOpen={iconInView?.name === icon?.name}
                  onClick={() => setIconInView(icon)}
                >
                  <Icon className="-mt-4 h-6 w-6 stroke-current" />
                </Tile>
              );
            })}
          </div>
        ) : (
          <Transition
            appear={true}
            show={true}
            enter="transition-opacity duration-300 ease-in"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-250 ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="py-10 text-center font-bold space-y-2">
              <p>It looks like we don't have an icon for that yet!</p>
              <a
                href={`https://github.com/lifeomic/chromicons/issues/new?title=${encodeURIComponent(
                  `"${searchText}" icon request`
                )}`}
                className="text-sm text-blue-600 duration-300 ease-in-out transition-opacity hover:opacity-75 focus:outline-none focus-visible:shadow-outline focus-visible:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Please file a GitHub issue.
              </a>
            </div>
          </Transition>
        )}
      </main>
      <Footer />
    </>
  );
}
