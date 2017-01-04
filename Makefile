.PHONY: dist

dist:
	rm -rf dist
	./node_modules/.bin/babel js -d dist
