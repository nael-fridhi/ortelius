create or replace function dm.dm_insert_kubernetes() returns void as $$ begin IF NOT EXISTS (SELECT 1 FROM dm.dm_type WHERE name = 'Kubernetes') THEN insert into dm.dm_type (id,name, database, deletedir, domainid, status, creatorid, modifierid) (select max(id)+1 as id,'Kubernetes' as name, 'N', 'N', 1, 'N', 1, 1 from dm.dm_type);END IF;end;$$ LANGUAGE plpgsql;