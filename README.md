# jpasini.github.io
Personal website

## Building the Jekyll-based site and serving locally

Lots of instructions: https://help.github.com/en/articles/setting-up-your-github-pages-site-locally-with-jekyll

The main item needed is a `Gemfile`

```
bundle install
```
or, the first time,
```
bundle install --path vendor/bundle
```

This installs locally all dependencies and also creates `Gemfile.lock` with the
current versions.

If packages need to be updated (e.g., if a vulnerability is discovered in a
dependency), then we need to remove `Gemfile.lock` and run `bundle install` again.

To serve the site locally, run

```
bundle exec jekyll serve
```

and it will be located in `localhost:4000`



